from rest_framework import generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Complaint, ComplaintMedia, ComplaintUpdate
from .serializers import (
    ComplaintListSerializer,
    ComplaintDetailSerializer,
    ComplaintCreateSerializer,
    ComplaintStatusUpdateSerializer,
    ComplaintUpdateSerializer,
)


class ComplaintListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/complaints/ — List complaints (citizen sees own; officer sees municipality's).
    POST /api/complaints/ — File a new complaint.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Complaints"])
    def get_queryset(self):
        user = self.request.user
        qs = Complaint.objects.select_related("ward", "municipality", "assigned_officer").prefetch_related("media", "updates")
        if user.role == "citizen":
            return qs.filter(citizen=user)
        if user.role == "officer":
            return qs.filter(municipality=user.municipality)
        return qs

    def get_serializer_class(self):
        return ComplaintCreateSerializer if self.request.method == "POST" else ComplaintListSerializer

    def create(self, request, *args, **kwargs):
        serializer = ComplaintCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        complaint = serializer.save()
        return Response(ComplaintDetailSerializer(complaint).data, status=status.HTTP_201_CREATED)


class ComplaintDetailView(generics.RetrieveAPIView):
    """GET /api/complaints/{id}/ — Full complaint detail."""
    serializer_class = ComplaintDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Complaints"])
    def get_queryset(self):
        user = self.request.user
        qs = Complaint.objects.select_related("ward", "municipality").prefetch_related("media", "updates__author")
        if user.role == "citizen":
            return qs.filter(citizen=user)
        return qs


class ComplaintStatusUpdateView(generics.UpdateAPIView):
    """PATCH /api/complaints/{id}/status/ — Officer updates complaint status."""
    serializer_class = ComplaintStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch"]

    @extend_schema(tags=["Complaints"])
    def get_queryset(self):
        if self.request.user.role in ("officer", "admin"):
            return Complaint.objects.all()
        return Complaint.objects.none()

    def perform_update(self, serializer):
        from django.utils import timezone
        instance = serializer.save()
        if instance.status == Complaint.RESOLVED and not instance.resolved_at:
            instance.resolved_at = timezone.now()
            instance.save(update_fields=["resolved_at"])
        ComplaintUpdate.objects.create(
            complaint=instance,
            author=self.request.user,
            message=f"Status updated to {instance.get_status_display()}",
            status_change=instance.status,
        )


class ComplaintAddUpdateView(APIView):
    """POST /api/complaints/{id}/updates/ — Add a public update to a complaint."""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Complaints"])
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
        except Complaint.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        update = ComplaintUpdate.objects.create(
            complaint=complaint,
            author=request.user,
            message=request.data.get("message", ""),
        )
        return Response(ComplaintUpdateSerializer(update).data, status=status.HTTP_201_CREATED)


class ComplaintMediaUploadView(APIView):
    """POST /api/complaints/{id}/media/ — Upload photo/video for a complaint."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser]

    @extend_schema(tags=["Complaints"])
    def post(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk, citizen=request.user)
        except Complaint.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        file = request.FILES.get("file")
        file_type = request.data.get("file_type", "image")
        if not file:
            return Response({"detail": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)
        media = ComplaintMedia.objects.create(complaint=complaint, file=file, file_type=file_type)
        return Response({"id": str(media.id), "file": request.build_absolute_uri(media.file.url)}, status=status.HTTP_201_CREATED)


class TrackComplaintView(APIView):
    """GET /api/complaints/track/{complaint_number}/ — Public complaint tracking."""
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=["Complaints"])
    def get(self, request, complaint_number):
        try:
            complaint = Complaint.objects.prefetch_related("updates__author", "media").get(
                complaint_number=complaint_number
            )
            return Response(ComplaintDetailSerializer(complaint).data)
        except Complaint.DoesNotExist:
            return Response({"detail": "Complaint not found."}, status=status.HTTP_404_NOT_FOUND)
