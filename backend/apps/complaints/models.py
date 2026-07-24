import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Complaint(models.Model):
    """311-style citizen grievance with SLA and auto-escalation."""
    OPEN = "open"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    ESCALATED = "escalated"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REJECTED = "rejected"
    STATUS_CHOICES = [
        (OPEN, "Open"),
        (ASSIGNED, "Assigned"),
        (IN_PROGRESS, "In Progress"),
        (ESCALATED, "Escalated"),
        (RESOLVED, "Resolved"),
        (CLOSED, "Closed"),
        (REJECTED, "Rejected"),
    ]

    ROADS = "roads"
    STREETLIGHTS = "streetlights"
    WATER = "water"
    DRAINAGE = "drainage"
    SANITATION = "sanitation"
    PARKS = "parks"
    ENCROACHMENT = "encroachment"
    STRAY_ANIMALS = "stray_animals"
    PUBLIC_HEALTH = "public_health"
    NOISE = "noise"
    CATEGORY_CHOICES = [
        (ROADS, "Roads & Potholes"),
        (STREETLIGHTS, "Streetlights"),
        (WATER, "Water Supply"),
        (DRAINAGE, "Drainage & Sewage"),
        (SANITATION, "Sanitation & Waste"),
        (PARKS, "Parks & Gardens"),
        (ENCROACHMENT, "Encroachment"),
        (STRAY_ANIMALS, "Stray Animals"),
        (PUBLIC_HEALTH, "Public Health"),
        (NOISE, "Noise Pollution"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    complaint_number = models.CharField(max_length=50, unique=True)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name="complaints")
    municipality = models.ForeignKey("municipalities.Municipality", on_delete=models.CASCADE, related_name="complaints")
    ward = models.ForeignKey("municipalities.Ward", on_delete=models.SET_NULL, null=True, blank=True, related_name="complaints")

    # Complaint details
    title = models.CharField(max_length=500)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=500, help_text="Street / landmark")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Contact
    reporter_mobile = models.CharField(max_length=15)
    reporter_email = models.EmailField(blank=True)

    # Status & SLA
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=OPEN)
    priority = models.CharField(max_length=10, choices=[("low", "Low"), ("medium", "Medium"), ("high", "High"), ("urgent", "Urgent")], default="medium")
    sla_deadline = models.DateTimeField(null=True, blank=True)
    escalation_count = models.PositiveIntegerField(default=0)

    # Assignment
    assigned_officer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_complaints"
    )
    resolution_notes = models.TextField(blank=True)
    citizen_verified = models.BooleanField(default=False, help_text="Citizen confirmed resolution")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "complaints"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.complaint_number} — {self.title}"

    def save(self, *args, **kwargs):
        if not self.complaint_number:
            import random, datetime
            year = datetime.datetime.now().year
            self.complaint_number = f"CMP-{year}-{random.randint(10000, 99999)}"
        if not self.sla_deadline:
            self.sla_deadline = timezone.now() + timezone.timedelta(hours=48)
        super().save(*args, **kwargs)

    @property
    def is_overdue(self):
        return self.sla_deadline and timezone.now() > self.sla_deadline and self.status not in (self.RESOLVED, self.CLOSED)


class ComplaintMedia(models.Model):
    """Photos / videos attached to a complaint."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="media")
    file = models.FileField(upload_to="complaints/media/")
    file_type = models.CharField(max_length=20, choices=[("image", "Image"), ("video", "Video"), ("document", "Document")])
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "complaint_media"


class ComplaintUpdate(models.Model):
    """Officer updates / status changes on a complaint."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="updates")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    status_change = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "complaint_updates"
        ordering = ["created_at"]
