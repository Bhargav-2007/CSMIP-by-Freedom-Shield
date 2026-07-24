from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .models import Payment
from .serializers import PaymentListSerializer, PaymentDetailSerializer, PaymentCreateSerializer


class PaymentListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/payments/ — Payment history for the current citizen.
    POST /api/payments/ — Initiate a new payment.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Payments"])
    def get_queryset(self):
        user = self.request.user
        qs = Payment.objects.select_related("municipality")
        if user.role == "citizen":
            return qs.filter(citizen=user)
        if user.role == "officer":
            return qs.filter(municipality=user.municipality)
        return qs

    def get_serializer_class(self):
        return PaymentCreateSerializer if self.request.method == "POST" else PaymentListSerializer

    def create(self, request, *args, **kwargs):
        serializer = PaymentCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        return Response(PaymentDetailSerializer(payment).data, status=status.HTTP_201_CREATED)


class PaymentDetailView(generics.RetrieveAPIView):
    """GET /api/payments/{id}/ — Payment detail."""
    serializer_class = PaymentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Payments"])
    def get_queryset(self):
        user = self.request.user
        if user.role == "citizen":
            return Payment.objects.filter(citizen=user)
        return Payment.objects.all()


class PaymentReceiptView(APIView):
    """GET /api/payments/{id}/receipt/ — Return receipt data for PDF generation."""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Payments"])
    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk, citizen=request.user)
        except Payment.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "id": payment.transaction_id,
            "description": payment.description,
            "amount": str(payment.total_amount),
            "mode": payment.get_mode_display(),
            "date": payment.paid_at.strftime("%d %b %Y, %I:%M %p") if payment.paid_at else "",
            "payer": request.user.full_name,
            "municipality": payment.municipality.name,
            "status": payment.status,
        })
