from rest_framework import generics, permissions, parsers, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import Document
from .serializers import DocumentSerializer, DocumentUploadSerializer


class DocumentListView(generics.ListAPIView):
    """GET /api/documents/ — List citizen's document vault."""
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["document_type", "source"]

    @extend_schema(tags=["Documents"])
    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user)


class DocumentUploadView(generics.CreateAPIView):
    """POST /api/documents/upload/ — Upload a document to vault."""
    serializer_class = DocumentUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser]

    @extend_schema(tags=["Documents"])
    def create(self, request, *args, **kwargs):
        serializer = DocumentUploadSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        doc = serializer.save()
        return Response(DocumentSerializer(doc).data, status=status.HTTP_201_CREATED)


class DocumentDeleteView(generics.DestroyAPIView):
    """DELETE /api/documents/{id}/ — Remove a document from vault."""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Documents"])
    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user)
