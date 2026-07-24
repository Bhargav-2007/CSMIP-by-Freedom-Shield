from django.urls import path
from .views import PaymentListCreateView, PaymentDetailView, PaymentReceiptView

urlpatterns = [
    path("", PaymentListCreateView.as_view(), name="payment-list"),
    path("<uuid:pk>/", PaymentDetailView.as_view(), name="payment-detail"),
    path("<uuid:pk>/receipt/", PaymentReceiptView.as_view(), name="payment-receipt"),
]
