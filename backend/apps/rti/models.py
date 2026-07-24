import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class RTIRequest(models.Model):
    """Right to Information request by a citizen."""
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    INFORMATION_PROVIDED = "information_provided"
    REJECTED = "rejected"
    FIRST_APPEAL = "first_appeal"
    SECOND_APPEAL = "second_appeal"
    CLOSED = "closed"
    
    STATUS_CHOICES = [
        (SUBMITTED, "Submitted"),
        (UNDER_REVIEW, "Under Review"),
        (INFORMATION_PROVIDED, "Information Provided"),
        (REJECTED, "Rejected"),
        (FIRST_APPEAL, "First Appeal"),
        (SECOND_APPEAL, "Second Appeal"),
        (CLOSED, "Closed"),
    ]

    CENTRAL = "central"
    STATE = "state"
    MUNICIPAL = "municipal"
    
    AUTHORITY_TYPE_CHOICES = [
        (CENTRAL, "Central Government"),
        (STATE, "State Government"),
        (MUNICIPAL, "Municipal Corporation"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rti_number = models.CharField(max_length=50, unique=True)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rti_requests")
    municipality = models.ForeignKey(
        "municipalities.Municipality", on_delete=models.CASCADE, related_name="rti_requests"
    )
    
    # Request Details
    subject = models.CharField(max_length=500)
    information_sought = models.TextField(help_text="Details of information being requested")
    authority_type = models.CharField(max_length=20, choices=AUTHORITY_TYPE_CHOICES, default=MUNICIPAL)
    department = models.ForeignKey(
        "municipalities.Department", on_delete=models.SET_NULL, null=True, blank=True, related_name="rti_requests"
    )
    
    # Status & Timeline
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SUBMITTED)
    fees_paid = models.DecimalField(max_digits=8, decimal_places=2, default=10.00)
    fees_exemption_reason = models.TextField(blank=True)
    
    # Officer Assignment
    assigned_officer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_rti_requests"
    )
    
    # Response
    response_text = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    response_due_date = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "rti_requests"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.rti_number} — {self.subject[:50]}"

    def save(self, *args, **kwargs):
        if not self.rti_number:
            import random, datetime
            year = datetime.datetime.now().year
            self.rti_number = f"RTI-{year}-{random.randint(100000, 999999)}"
        
        # Set response due date (30 days from submission as per RTI Act)
        if not self.response_due_date and self.submitted_at:
            from datetime import timedelta
            self.response_due_date = self.submitted_at + timedelta(days=30)
        
        super().save(*args, **kwargs)


class RTIAppeal(models.Model):
    """RTI Appeal (First Appeal or Second Appeal)."""
    FIRST_APPEAL = "first_appeal"
    SECOND_APPEAL = "second_appeal"
    
    APPEAL_TYPE_CHOICES = [
        (FIRST_APPEAL, "First Appeal"),
        (SECOND_APPEAL, "Second Appeal"),
    ]
    
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CLOSED = "closed"
    
    STATUS_CHOICES = [
        (SUBMITTED, "Submitted"),
        (UNDER_REVIEW, "Under Review"),
        (ACCEPTED, "Accepted"),
        (REJECTED, "Rejected"),
        (CLOSED, "Closed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appeal_number = models.CharField(max_length=50, unique=True)
    original_rti = models.ForeignKey(RTIRequest, on_delete=models.CASCADE, related_name="appeals")
    appeal_type = models.CharField(max_length=20, choices=APPEAL_TYPE_CHOICES)
    
    # Appeal Details
    grounds_for_appeal = models.TextField(help_text="Reasons for filing the appeal")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SUBMITTED)
    
    # Response
    appeal_response = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Officer Assignment (First Appellate Authority / Second Appellate Authority)
    assigned_officer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_rti_appeals"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    response_due_date = models.DateTimeField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "rti_appeals"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.appeal_number} — {self.appeal_type}"

    def save(self, *args, **kwargs):
        if not self.appeal_number:
            import random, datetime
            year = datetime.datetime.now().year
            prefix = "FA" if self.appeal_type == self.FIRST_APPEAL else "SA"
            self.appeal_number = f"{prefix}-{year}-{random.randint(100000, 999999)}"
        
        # Set response due date (30 days for first appeal, 45 days for second appeal)
        if not self.response_due_date and self.created_at:
            from datetime import timedelta
            days = 30 if self.appeal_type == self.FIRST_APPEAL else 45
            self.response_due_date = self.created_at + timedelta(days=days)
        
        super().save(*args, **kwargs)


class RTIDocument(models.Model):
    """Documents attached to RTI requests or appeals."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rti_request = models.ForeignKey(
        RTIRequest, on_delete=models.CASCADE, null=True, blank=True, related_name="documents"
    )
    rti_appeal = models.ForeignKey(
        RTIAppeal, on_delete=models.CASCADE, null=True, blank=True, related_name="documents"
    )
    
    document = models.FileField(upload_to="rti/documents/")
    document_name = models.CharField(max_length=255)
    document_type = models.CharField(
        max_length=50, 
        choices=[
            ("request", "Request Document"),
            ("response", "Response Document"),
            ("appeal", "Appeal Document"),
            ("supporting", "Supporting Document"),
        ],
        default="request"
    )
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "rti_documents"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.document_name} ({self.document_type})"


class RTITimeline(models.Model):
    """Timeline entries for RTI requests and appeals."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rti_request = models.ForeignKey(
        RTIRequest, on_delete=models.CASCADE, null=True, blank=True, related_name="timeline"
    )
    rti_appeal = models.ForeignKey(
        RTIAppeal, on_delete=models.CASCADE, null=True, blank=True, related_name="timeline"
    )
    
    action = models.CharField(max_length=100)
    description = models.TextField()
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    actor_role = models.CharField(max_length=50, blank=True, help_text="Citizen, Officer, Admin")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "rti_timeline"
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.action} - {self.timestamp.strftime('%d %b %Y')}"