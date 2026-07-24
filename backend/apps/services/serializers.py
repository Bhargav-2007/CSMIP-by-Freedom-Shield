from rest_framework import serializers
from .models import Service, ServiceFAQ


class ServiceFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFAQ
        fields = ["question", "answer"]


class ServiceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id", "name", "slug", "category", "description",
            "fee", "processing_time_days", "sla_hours", "is_online", "icon"
        ]


class ServiceDetailSerializer(serializers.ModelSerializer):
    faqs = ServiceFAQSerializer(many=True, read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True, allow_null=True)
    municipality_name = serializers.CharField(source="municipality.name", read_only=True, allow_null=True)

    class Meta:
        model = Service
        fields = [
            "id", "name", "slug", "category", "description", "eligibility",
            "required_documents", "processing_time_days", "fee", "fee_description",
            "sla_hours", "department_name", "municipality_name", "is_online", "icon", "faqs",
        ]
