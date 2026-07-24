from rest_framework import serializers
from .models import Complaint, ComplaintMedia, ComplaintUpdate


class ComplaintMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintMedia
        fields = ["id", "file", "file_type", "uploaded_at"]


class ComplaintUpdateSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = ComplaintUpdate
        fields = ["id", "author_name", "message", "status_change", "created_at"]


class ComplaintListSerializer(serializers.ModelSerializer):
    ward_name = serializers.CharField(source="ward.name", read_only=True, allow_null=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id", "complaint_number", "title", "category", "status",
            "priority", "ward_name", "location", "sla_deadline",
            "is_overdue", "escalation_count", "created_at",
        ]


class ComplaintDetailSerializer(serializers.ModelSerializer):
    media = ComplaintMediaSerializer(many=True, read_only=True)
    updates = ComplaintUpdateSerializer(many=True, read_only=True)
    ward_name = serializers.CharField(source="ward.name", read_only=True, allow_null=True)
    municipality_name = serializers.CharField(source="municipality.name", read_only=True)
    assigned_officer_name = serializers.CharField(source="assigned_officer.full_name", read_only=True, allow_null=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id", "complaint_number", "title", "description", "category",
            "location", "latitude", "longitude", "ward_name",
            "municipality_name", "status", "priority", "sla_deadline",
            "is_overdue", "escalation_count", "assigned_officer_name",
            "resolution_notes", "citizen_verified", "media", "updates",
            "created_at", "updated_at", "resolved_at",
        ]


class ComplaintCreateSerializer(serializers.ModelSerializer):
    municipality_id = serializers.UUIDField()
    ward_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Complaint
        fields = [
            "title", "description", "category", "location",
            "latitude", "longitude", "reporter_mobile", "reporter_email",
            "municipality_id", "ward_id", "priority",
        ]

    def create(self, validated_data):
        from apps.municipalities.models import Municipality, Ward
        municipality = Municipality.objects.get(id=validated_data.pop("municipality_id"))
        ward_id = validated_data.pop("ward_id", None)
        ward = Ward.objects.get(id=ward_id) if ward_id else None
        user = self.context["request"].user
        return Complaint.objects.create(citizen=user, municipality=municipality, ward=ward, **validated_data)


class ComplaintStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ["status", "resolution_notes", "assigned_officer", "priority"]
