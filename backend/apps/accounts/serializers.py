from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import hashlib
import random
import string
from apps.municipalities.models import Municipality
from .models import OTPVerification
from .validators import (
    validate_indian_mobile,
    validate_strong_password,
    validate_employee_id,
    validate_government_email,
    sanitize_name,
)

User = get_user_model()


class MunicipalityMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipality
        fields = ["id", "name", "slug", "state"]


class UserSerializer(serializers.ModelSerializer):
    municipality = MunicipalityMiniSerializer(read_only=True)
    display_id = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            "id", "email", "mobile", "full_name", "role", "display_id",
            "municipality", "department", "employee_id", "avatar",
            "preferred_language", "is_verified", "date_joined",
        ]
        read_only_fields = ["id", "email", "role", "is_verified", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, validators=[validate_strong_password])
    confirm_password = serializers.CharField(write_only=True)
    municipality_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "email", "password", "confirm_password", "full_name",
            "mobile", "role", "municipality_id", "department", "employee_id",
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_mobile(self, value):
        if value:
            value = validate_indian_mobile(value)
            if User.objects.filter(mobile=value).exists():
                raise serializers.ValidationError("A user with this mobile number already exists.")
        return value

    def validate_full_name(self, value):
        return sanitize_name(value)

    def validate_employee_id(self, value):
        if value and self.initial_data.get('role') == 'officer':
            municipality_id = self.initial_data.get('municipality_id')
            municipality = None
            if municipality_id:
                try:
                    municipality = Municipality.objects.get(id=municipality_id)
                except Municipality.DoesNotExist:
                    pass
            return validate_employee_id(value, municipality)
        return value

    def validate(self, data):
        if data["password"] != data.pop("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        
        # Validate role-specific requirements
        role = data.get("role", "citizen")
        
        if role == "officer":
            if not data.get("municipality_id"):
                raise serializers.ValidationError({"municipality_id": "Municipality is required for officers."})
            if not data.get("department"):
                raise serializers.ValidationError({"department": "Department is required for officers."})
        
        return data

    def create(self, validated_data):
        municipality_id = validated_data.pop("municipality_id", None)
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        
        if municipality_id:
            try:
                user.municipality = Municipality.objects.get(id=municipality_id)
            except Municipality.DoesNotExist:
                pass
        
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["full_name"] = user.full_name
        token["display_id"] = user.display_id
        return token


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class SendOTPSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)
    purpose = serializers.ChoiceField(
        choices=[("register", "Registration"), ("login", "Login"), ("verify", "Verification")],
        default="login"
    )

    def validate_mobile(self, value):
        return validate_indian_mobile(value)


class VerifyOTPSerializer(serializers.Serializer):
    mobile = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)
    purpose = serializers.CharField(default="login")

    def validate(self, data):
        mobile = data.get("mobile")
        otp = data.get("otp")
        purpose = data.get("purpose")

        # Find the most recent valid OTP for this mobile and purpose
        try:
            otp_record = OTPVerification.objects.filter(
                mobile=mobile,
                purpose=purpose,
                is_used=False,
                expires_at__gt=timezone.now()
            ).order_by("-created_at").first()

            if not otp_record:
                raise serializers.ValidationError("No valid OTP found or OTP expired.")

            # Hash the provided OTP and compare
            otp_hash = hashlib.sha256(f"{otp}".encode()).hexdigest()
            if otp_hash != otp_record.otp_hash:
                raise serializers.ValidationError("Invalid OTP.")

            # Mark OTP as used
            otp_record.is_used = True
            otp_record.save()

            data["otp_record"] = otp_record
            return data

        except Exception as e:
            raise serializers.ValidationError("OTP verification failed.")


class MobileLoginSerializer(serializers.Serializer):
    """Login using mobile number and OTP."""
    mobile = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        # First verify the OTP
        otp_serializer = VerifyOTPSerializer(data={
            "mobile": data["mobile"],
            "otp": data["otp"],
            "purpose": "login"
        })
        
        if otp_serializer.is_valid():
            otp_record = otp_serializer.validated_data["otp_record"]
            
            # Find or create user with this mobile number
            try:
                user = User.objects.get(mobile=data["mobile"])
                data["user"] = user
                return data
            except User.DoesNotExist:
                raise serializers.ValidationError("No account found with this mobile number.")
        else:
            raise serializers.ValidationError(otp_serializer.errors)


class AadhaarVerificationSerializer(serializers.Serializer):
    """Aadhaar eKYC verification (mock for now)."""
    aadhaar_number = serializers.CharField(max_length=12)
    mobile = serializers.CharField(max_length=15)

    def validate_aadhaar_number(self, value):
        # Basic Aadhaar validation (12 digits)
        if not value.isdigit() or len(value) != 12:
            raise serializers.ValidationError("Invalid Aadhaar number format.")
        return value

    def validate(self, data):
        # In production, this would integrate with UIDAI eKYC APIs
        # For now, we'll mock the verification
        data["is_verified"] = True
        data["name"] = "Mock Name"  # Would come from UIDAI
        data["address"] = "Mock Address"  # Would come from UIDAI
        return data


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Enhanced profile update with additional validation."""
    
    class Meta:
        model = User
        fields = [
            "full_name", "mobile", "avatar", "preferred_language",
            "department", "employee_id"
        ]
    
    def validate_mobile(self, value):
        # Check if mobile is already in use by another user
        if value and User.objects.filter(mobile=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("This mobile number is already registered.")
        return value
