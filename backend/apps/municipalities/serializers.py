from rest_framework import serializers
from .models import Municipality, Department, Ward, Announcement


class WardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ward
        fields = ["id", "number", "name", "zone", "councillor_name"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "name", "code", "description", "phone", "email"]


class MunicipalityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipality
        fields = ["id", "name", "short_name", "slug", "state", "ulb_type", "logo", "is_active"]


class MunicipalityDetailSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    wards = WardSerializer(many=True, read_only=True)

    class Meta:
        model = Municipality
        fields = [
            "id", "name", "short_name", "slug", "ulb_type", "state", "district",
            "latitude", "longitude", "logo", "primary_color", "accent_color",
            "website", "phone", "email", "address", "helpline",
            "supported_languages", "departments", "wards", "is_active",
        ]


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ["id", "title", "body", "category", "is_emergency", "is_pinned", "published_at", "expires_at"]
