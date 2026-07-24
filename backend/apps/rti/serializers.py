from rest_framework import serializers
from .models import RTIRequest, RTIAppeal, RTIDocument, RTITimeline


class RTIDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source="uploaded_by.full_name", read_only=True)
    
    class Meta:
        model = RTIDocument
        fields = [
            "id",
            "document",
            "document_name", 
            "document_type",
            "uploaded_by",
            "uploaded_by_name",
            "uploaded_at"
        ]
        read_only_fields = ["id", "uploaded_by", "uploaded_at"]


class RTITimelineSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.full_name", read_only=True)
    
    class Meta:
        model = RTITimeline
        fields = [
            "id",
            "action",
            "description", 
            "actor",
            "actor_name",
            "actor_role",
            "timestamp"
        ]
        read_only_fields = ["id", "actor", "timestamp"]


class RTIRequestSerializer(serializers.ModelSerializer):
    citizen_name = serializers.CharField(source="citizen.full_name", read_only=True)
    municipality_name = serializers.CharField(source="municipality.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)
    assigned_officer_name = serializers.CharField(source="assigned_officer.full_name", read_only=True)
    documents = RTIDocumentSerializer(many=True, read_only=True)
    timeline = RTITimelineSerializer(many=True, read_only=True)
    appeals_count = serializers.SerializerMethodField()
    
    class Meta:
        model = RTIRequest
        fields = [
            "id",
            "rti_number",
            "citizen",
            "citizen_name",
            "municipality",
            "municipality_name",
            "subject",
            "information_sought",
            "authority_type",
            "department",
            "department_name",
            "status",
            "fees_paid",
            "fees_exemption_reason",
            "assigned_officer",
            "assigned_officer_name",
            "response_text",
            "rejection_reason",
            "created_at",
            "updated_at",
            "submitted_at",
            "response_due_date",
            "responded_at",
            "documents",
            "timeline",
            "appeals_count"
        ]
        read_only_fields = [
            "id",
            "rti_number", 
            "citizen",
            "created_at",
            "updated_at",
            "submitted_at"
        ]
    
    def get_appeals_count(self, obj):
        return obj.appeals.count()


class RTIAppealSerializer(serializers.ModelSerializer):
    original_rti_number = serializers.CharField(source="original_rti.rti_number", read_only=True)
    assigned_officer_name = serializers.CharField(source="assigned_officer.full_name", read_only=True)
    documents = RTIDocumentSerializer(many=True, read_only=True)
    timeline = RTITimelineSerializer(many=True, read_only=True)
    
    class Meta:
        model = RTIAppeal
        fields = [
            "id",
            "appeal_number",
            "original_rti",
            "original_rti_number",
            "appeal_type",
            "grounds_for_appeal",
            "status",
            "appeal_response",
            "rejection_reason",
            "assigned_officer",
            "assigned_officer_name",
            "created_at",
            "updated_at",
            "response_due_date",
            "responded_at",
            "documents",
            "timeline"
        ]
        read_only_fields = [
            "id",
            "appeal_number",
            "created_at", 
            "updated_at"
        ]


class RTIRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RTIRequest
        fields = [
            "subject",
            "information_sought",
            "authority_type",
            "department",
            "fees_exemption_reason"
        ]
    
    def create(self, validated_data):
        # The citizen and municipality will be set in the view
        return super().create(validated_data)


class RTIAppealCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RTIAppeal
        fields = [
            "original_rti",
            "appeal_type",
            "grounds_for_appeal"
        ]
    
    def validate_original_rti(self, value):
        # Ensure the RTI belongs to the requesting citizen
        if hasattr(self.context.get('request'), 'user'):
            if value.citizen != self.context['request'].user:
                raise serializers.ValidationError("You can only file appeals for your own RTI requests.")
        return value