from rest_framework import generics, permissions, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import Facility, Booking
from .serializers import FacilitySerializer, BookingListSerializer, BookingDetailSerializer, BookingCreateSerializer


class FacilityListView(generics.ListAPIView):
    """GET /api/bookings/facilities/ — List bookable public facilities."""
    serializer_class = FacilitySerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["facility_type", "municipality__slug"]

    @extend_schema(tags=["Bookings"])
    def get_queryset(self):
        return Facility.objects.filter(is_active=True).select_related("municipality")


class BookingListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/bookings/ — List citizen's bookings or create a new one."""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Bookings"])
    def get_queryset(self):
        return Booking.objects.filter(citizen=self.request.user).select_related("facility")

    def get_serializer_class(self):
        return BookingCreateSerializer if self.request.method == "POST" else BookingListSerializer

    def create(self, request, *args, **kwargs):
        serializer = BookingCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(BookingDetailSerializer(booking).data, status=status.HTTP_201_CREATED)


class BookingDetailView(generics.RetrieveDestroyAPIView):
    """GET/DELETE /api/bookings/{id}/ — Booking detail or cancellation."""
    serializer_class = BookingDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Bookings"])
    def get_queryset(self):
        return Booking.objects.filter(citizen=self.request.user)

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        booking.status = Booking.CANCELLED
        booking.save()
        return Response({"detail": "Booking cancelled."}, status=status.HTTP_200_OK)
