import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    CITIZEN = "citizen"
    OFFICER = "officer"
    ADMIN = "admin"
    ROLE_CHOICES = [
        (CITIZEN, "Citizen"),
        (OFFICER, "Municipal Officer"),
        (ADMIN, "Administrator"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15, blank=True)
    full_name = models.CharField(max_length=255)
    aadhaar_last4 = models.CharField(max_length=4, blank=True, help_text="Last 4 digits (never store full Aadhaar)")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=CITIZEN)
    municipality = models.ForeignKey(
        "municipalities.Municipality",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    department = models.CharField(max_length=100, blank=True, help_text="For officers")
    employee_id = models.CharField(max_length=50, blank=True, unique=False)

    # Profile
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    preferred_language = models.CharField(max_length=10, default="en")
    is_verified = models.BooleanField(default=False, help_text="KYC verified via Aadhaar/DigiLocker")

    # Status
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    objects = UserManager()

    class Meta:
        db_table = "auth_users"
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.full_name} ({self.role})"

    @property
    def display_id(self):
        prefix = {"citizen": "CIT", "officer": "OFF", "admin": "ADM"}[self.role]
        return f"{prefix}-{str(self.id)[:8].upper()}"


class OTPVerification(models.Model):
    """Stores OTP for mobile/Aadhaar verification."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps", null=True, blank=True)
    mobile = models.CharField(max_length=15)
    otp_hash = models.CharField(max_length=128)
    purpose = models.CharField(max_length=50, default="login")  # login, register, aadhaar
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = "auth_otp_verifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"OTP for {self.mobile} ({self.purpose})"
