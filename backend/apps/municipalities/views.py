from rest_framework import generics, permissions
from drf_spectacular.utils import extend_schema
from .models import Municipality, Announcement
from .serializers import MunicipalityListSerializer, MunicipalityDetailSerializer, AnnouncementSerializer


class MunicipalityListView(generics.ListAPIView):
    """GET /api/municipalities/ — List all active municipalities."""
    queryset = Municipality.objects.filter(is_active=True)
    serializer_class = MunicipalityListSerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ["name", "state", "slug"]
    filterset_fields = ["state", "ulb_type"]

    @extend_schema(tags=["Municipalities"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MunicipalityDetailView(generics.RetrieveAPIView):
    """GET /api/municipalities/{slug}/ — Get municipality config including departments and wards."""
    queryset = Municipality.objects.filter(is_active=True)
    serializer_class = MunicipalityDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    @extend_schema(tags=["Municipalities"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class AnnouncementListView(generics.ListAPIView):
    """GET /api/municipalities/{slug}/announcements/ — Get active announcements."""
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=["Municipalities"])
    def get_queryset(self):
        return Announcement.objects.filter(municipality__slug=self.kwargs["slug"]).order_by("-is_pinned", "-published_at")
