import uuid
from django.db import models


class Service(models.Model):
    """Government service catalog entry."""
    CERTIFICATE = "certificate"
    PAYMENT = "payment"
    COMPLAINT = "complaint"
    LICENSE = "license"
    BOOKING = "booking"
    RTI = "rti"
    SCHEME = "scheme"
    EMERGENCY = "emergency"
    CATEGORY_CHOICES = [
        (CERTIFICATE, "Certificate"),
        (PAYMENT, "Tax / Utility Payment"),
        (COMPLAINT, "Complaint / Grievance"),
        (LICENSE, "License & Permit"),
        (BOOKING, "Public Facility Booking"),
        (RTI, "RTI Request"),
        (SCHEME, "Government Scheme"),
        (EMERGENCY, "Emergency Service"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    eligibility = models.TextField(blank=True)
    required_documents = models.JSONField(default=list)  # ["Aadhaar", "Birth Proof"]
    processing_time_days = models.PositiveIntegerField(default=7)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fee_description = models.CharField(max_length=255, blank=True)
    sla_hours = models.PositiveIntegerField(default=72, help_text="Service Level Agreement in hours")
    department = models.ForeignKey(
        "municipalities.Department", on_delete=models.SET_NULL, null=True, blank=True, related_name="services"
    )
    municipality = models.ForeignKey(
        "municipalities.Municipality", on_delete=models.CASCADE, related_name="services", null=True, blank=True
    )
    is_online = models.BooleanField(default=True, help_text="Can be applied online?")
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    icon = models.CharField(max_length=100, blank=True, help_text="Lucide icon name")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "services"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class ServiceFAQ(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="faqs")
    question = models.TextField()
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "service_faqs"
        ordering = ["order"]
