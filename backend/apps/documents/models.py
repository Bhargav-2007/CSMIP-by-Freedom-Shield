import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Document(models.Model):
    """Citizen document vault — stores uploaded files linked to DigiLocker or local upload."""
    AADHAAR = "aadhaar"
    PAN = "pan"
    BIRTH_CERT = "birth_certificate"
    DEATH_CERT = "death_certificate"
    INCOME_CERT = "income_certificate"
    CASTE_CERT = "caste_certificate"
    PROPERTY = "property_document"
    OTHER = "other"
    DOC_TYPE_CHOICES = [
        (AADHAAR, "Aadhaar Card"),
        (PAN, "PAN Card"),
        (BIRTH_CERT, "Birth Certificate"),
        (DEATH_CERT, "Death Certificate"),
        (INCOME_CERT, "Income Certificate"),
        (CASTE_CERT, "Caste Certificate"),
        (PROPERTY, "Property Document"),
        (OTHER, "Other"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=30, choices=DOC_TYPE_CHOICES, default=OTHER)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/vault/")
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    mime_type = models.CharField(max_length=100)
    source = models.CharField(max_length=20, choices=[("upload", "Local Upload"), ("digilocker", "DigiLocker")], default="upload")
    is_verified = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "documents"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.owner.email} — {self.title}"
