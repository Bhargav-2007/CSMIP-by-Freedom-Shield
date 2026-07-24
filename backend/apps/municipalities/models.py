import uuid
from django.db import models


class Municipality(models.Model):
    """Multi-tenant ULB (Urban Local Body) configuration."""
    MUNICIPAL_CORPORATION = "municipal_corporation"
    MUNICIPAL_COUNCIL = "municipal_council"
    NAGAR_PANCHAYAT = "nagar_panchayat"
    TYPE_CHOICES = [
        (MUNICIPAL_CORPORATION, "Municipal Corporation"),
        (MUNICIPAL_COUNCIL, "Municipal Council"),
        (NAGAR_PANCHAYAT, "Nagar Panchayat"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=50, blank=True)
    slug = models.SlugField(unique=True)
    ulb_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default=MUNICIPAL_CORPORATION)

    # Location
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Branding
    logo = models.ImageField(upload_to="municipality/logos/", null=True, blank=True)
    primary_color = models.CharField(max_length=20, default="#142f58")
    accent_color = models.CharField(max_length=20, default="#FF671F")
    website = models.URLField(blank=True)

    # Contact
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    helpline = models.CharField(max_length=20, blank=True)

    # Config
    supported_languages = models.JSONField(default=list)  # ["en", "hi", "gu"]
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "municipalities"
        verbose_name = "Municipality"
        verbose_name_plural = "Municipalities"
        ordering = ["state", "name"]

    def __str__(self):
        return f"{self.name} ({self.state})"


class Department(models.Model):
    """Municipal department within a ULB."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE, related_name="departments")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    head_officer = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="headed_departments"
    )
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "municipality_departments"
        unique_together = [["municipality", "code"]]
        ordering = ["name"]

    def __str__(self):
        return f"{self.municipality.short_name or self.municipality.name} — {self.name}"


class Ward(models.Model):
    """Ward within a municipality."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE, related_name="wards")
    number = models.PositiveIntegerField()
    name = models.CharField(max_length=255)
    zone = models.CharField(max_length=100, blank=True)
    councillor_name = models.CharField(max_length=255, blank=True)
    population = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = "municipality_wards"
        unique_together = [["municipality", "number"]]
        ordering = ["number"]

    def __str__(self):
        return f"Ward {self.number} · {self.name}"


class Announcement(models.Model):
    """Public notices and announcements by a municipality."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE, related_name="announcements")
    title = models.CharField(max_length=500)
    body = models.TextField()
    category = models.CharField(max_length=50, default="general")
    is_emergency = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    published_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey("accounts.User", on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = "municipality_announcements"
        ordering = ["-is_pinned", "-published_at"]
