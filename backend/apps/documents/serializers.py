from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            "id", "document_type", "title", "file", "file_size",
            "mime_type", "source", "is_verified", "uploaded_at", "expires_at"
        ]
        read_only_fields = ["id", "is_verified", "uploaded_at"]


class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["document_type", "title", "file"]

    def create(self, validated_data):
        file = validated_data["file"]
        validated_data["file_size"] = file.size
        validated_data["mime_type"] = file.content_type or "application/octet-stream"
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
