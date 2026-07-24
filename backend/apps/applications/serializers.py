from rest_framework import serializers
from .models import ServiceApplication, ApplicationTimeline
from apps.services.serializers import ServiceListSerializer


class TimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationTimeline
        fields = ["id", "label", "description", "state", "actor", "timestamp", "created_at"]


class ApplicationListSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)
    service_category = serializers.CharField(source="service.category", read_only=True)

    class Meta:
        model = ServiceApplication
        fields = [
            "id", "application_number", "service_name", "service_category",
            "status", "amount", "created_at", "updated_at"
        ]


class ApplicationDetailSerializer(serializers.ModelSerializer):
    service = ServiceListSerializer(read_only=True)
    timeline = TimelineSerializer(many=True, read_only=True)
    citizen_name = serializers.CharField(source="citizen.full_name", read_only=True)
    municipality_name = serializers.CharField(source="municipality.name", read_only=True)

    class Meta:
        model = ServiceApplication
        fields = [
            "id", "application_number", "citizen_name", "municipality_name",
            "service", "status", "fields_data", "amount", "notes",
            "rejection_reason", "timeline", "created_at", "updated_at",
            "approved_at", "completed_at",
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    service_id = serializers.UUIDField()
    municipality_id = serializers.UUIDField()

    class Meta:
        model = ServiceApplication
        fields = ["service_id", "municipality_id", "fields_data", "amount"]

    def create(self, validated_data):
        from apps.services.models import Service
        from apps.municipalities.models import Municipality
        from django.utils import timezone

        service = Service.objects.get(id=validated_data.pop("service_id"))
        municipality = Municipality.objects.get(id=validated_data.pop("municipality_id"))
        user = self.context["request"].user
        app = ServiceApplication.objects.create(
            citizen=user,
            service=service,
            municipality=municipality,
            **validated_data,
        )

        # Create default timeline
        steps = [
            {"label": "Submitted", "state": "done", "actor": user.full_name},
            {"label": "Document Verification", "state": "current", "actor": "Auto-OCR + Officer"},
            {"label": "Under Review", "state": "pending", "actor": "Ward / Zonal Officer"},
            {"label": "Approval", "state": "pending", "actor": "Deputy Commissioner"},
            {"label": "Issued / Completed", "state": "pending", "actor": "System"},
        ]
        for step in steps:
            ApplicationTimeline.objects.create(application=app, timestamp=timezone.now() if step["state"] == "done" else None, **step)

        return app


class ApplicationUpdateSerializer(serializers.ModelSerializer):
    """Officer/admin updates status and notes."""
    class Meta:
        model = ServiceApplication
        fields = ["status", "notes", "rejection_reason", "assigned_officer"]
