from rest_framework import generics, permissions
from drf_spectacular.utils import extend_schema
from .models import Service
from .serializers import ServiceListSerializer, ServiceDetailSerializer


class ServiceListView(generics.ListAPIView):
    """GET /api/services/ — Browse the service catalog with filters."""
    queryset = Service.objects.filter(is_active=True).select_related("department", "municipality")
    serializer_class = ServiceListSerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ["name", "description", "category"]
    filterset_fields = ["category", "municipality__slug", "department__id", "is_online"]
    ordering_fields = ["sort_order", "name", "fee"]

    @extend_schema(tags=["Services"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ServiceDetailView(generics.RetrieveAPIView):
    """GET /api/services/{slug}/ — Get full service detail including FAQs and eligibility."""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    @extend_schema(tags=["Services"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
