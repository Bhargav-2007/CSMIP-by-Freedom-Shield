from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import ServiceApplication
from .serializers import (
    ApplicationListSerializer,
    ApplicationDetailSerializer,
    ApplicationCreateSerializer,
    ApplicationUpdateSerializer,
)


class IsOwnerOrOfficer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in ("officer", "admin"):
            return True
        return obj.citizen == request.user


class ApplicationListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/applications/ — List citizen's own applications (or all for officers).
    POST /api/applications/ — Submit a new service application.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Applications"])
    def get_queryset(self):
        user = self.request.user
        qs = ServiceApplication.objects.select_related("service", "municipality").prefetch_related("timeline")
        if user.role == "citizen":
            return qs.filter(citizen=user)
        if user.role == "officer":
            return qs.filter(municipality=user.municipality)
        return qs  # admin sees all

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ApplicationCreateSerializer
        return ApplicationListSerializer

    def create(self, request, *args, **kwargs):
        serializer = ApplicationCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        app = serializer.save()
        return Response(ApplicationDetailSerializer(app).data, status=status.HTTP_201_CREATED)


class ApplicationDetailView(generics.RetrieveAPIView):
    """GET /api/applications/{id}/ — Get full application detail with timeline."""
    serializer_class = ApplicationDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrOfficer]

    @extend_schema(tags=["Applications"])
    def get_queryset(self):
        return ServiceApplication.objects.select_related("service", "municipality", "citizen").prefetch_related("timeline")


class ApplicationStatusUpdateView(generics.UpdateAPIView):
    """PATCH /api/applications/{id}/status/ — Officer updates application status."""
    serializer_class = ApplicationUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch"]

    @extend_schema(tags=["Applications"])
    def get_queryset(self):
        user = self.request.user
        if user.role in ("officer", "admin"):
            return ServiceApplication.objects.all()
        return ServiceApplication.objects.none()

    def perform_update(self, serializer):
        from django.utils import timezone
        from .models import ApplicationTimeline
        instance = serializer.save()
        # Add timeline entry
        ApplicationTimeline.objects.create(
            application=instance,
            label=f"Status updated to {instance.get_status_display()}",
            state="done",
            actor=self.request.user.full_name,
            timestamp=timezone.now(),
        )


class TrackApplicationView(APIView):
    """GET /api/applications/track/{application_number}/ — Public tracking by application number."""
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=["Applications"])
    def get(self, request, application_number):
        try:
            app = ServiceApplication.objects.prefetch_related("timeline").select_related("service").get(
                application_number=application_number
            )
            return Response(ApplicationDetailSerializer(app).data)
        except ServiceApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
