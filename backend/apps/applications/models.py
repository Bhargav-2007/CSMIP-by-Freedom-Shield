import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ServiceApplication(models.Model):
    """A citizen's application for any government service."""
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    IN_PROGRESS = "in_progress"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    STATUS_CHOICES = [
        (SUBMITTED, "Submitted"),
        (UNDER_REVIEW, "Under Review"),
        (IN_PROGRESS, "In Progress"),
        (APPROVED, "Approved"),
        (REJECTED, "Rejected"),
        (COMPLETED, "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application_number = models.CharField(max_length=50, unique=True)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name="applications")
    service = models.ForeignKey("services.Service", on_delete=models.PROTECT, related_name="applications")
    municipality = models.ForeignKey(
        "municipalities.Municipality", on_delete=models.CASCADE, related_name="applications"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SUBMITTED)
    fields_data = models.JSONField(default=dict, help_text="Form field values submitted by citizen")
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True, help_text="Officer notes")
    rejection_reason = models.TextField(blank=True)
    assigned_officer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_applications"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "service_applications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.application_number} — {self.service.name}"

    def save(self, *args, **kwargs):
        if not self.application_number:
            import random, datetime
            year = datetime.datetime.now().year
            prefix = {
                "certificate": "CERT",
                "payment": "PAY",
                "complaint": "CMP",
                "license": "LIC",
                "booking": "BOOK",
                "rti": "RTI",
                "scheme": "SCH",
            }.get(self.service.category, "APP")
            self.application_number = f"{prefix}-{year}-{random.randint(10000, 99999)}"
        super().save(*args, **kwargs)


class ApplicationTimeline(models.Model):
    """Timeline steps for a service application."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(ServiceApplication, on_delete=models.CASCADE, related_name="timeline")
    label = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    state = models.CharField(max_length=10, choices=[("done", "Done"), ("current", "Current"), ("pending", "Pending")])
    actor = models.CharField(max_length=255, blank=True, help_text="Who performed this step")
    timestamp = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "application_timeline"
        ordering = ["created_at"]
