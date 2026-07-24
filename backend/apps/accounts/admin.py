from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTPVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "full_name", "role", "municipality", "is_verified", "is_active", "date_joined"]
    list_filter = ["role", "is_verified", "is_active", "municipality"]
    search_fields = ["email", "full_name", "mobile"]
    ordering = ["-date_joined"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("full_name", "mobile", "aadhaar_last4", "avatar", "preferred_language")}),
        ("Role & Org", {"fields": ("role", "municipality", "department", "employee_id")}),
        ("Verification", {"fields": ("is_verified",)}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("date_joined", "last_login_at")}),
    )
    readonly_fields = ["date_joined", "last_login_at"]
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "full_name", "role", "password1", "password2"),
        }),
    )


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ["user", "mobile", "purpose", "created_at", "is_used"]
    list_filter = ["purpose", "is_used"]
