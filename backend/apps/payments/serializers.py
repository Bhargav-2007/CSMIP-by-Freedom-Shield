from rest_framework import serializers
from .models import Payment


class PaymentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id", "transaction_id", "payment_type", "description",
            "total_amount", "status", "mode", "period", "paid_at", "created_at",
        ]


class PaymentDetailSerializer(serializers.ModelSerializer):
    municipality_name = serializers.CharField(source="municipality.name", read_only=True)
    citizen_name = serializers.CharField(source="citizen.full_name", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id", "transaction_id", "citizen_name", "municipality_name",
            "payment_type", "description", "amount", "tax_amount",
            "penalty_amount", "total_amount", "status", "mode",
            "property_id", "consumer_number", "period",
            "paid_at", "created_at",
        ]


class PaymentCreateSerializer(serializers.ModelSerializer):
    municipality_id = serializers.UUIDField()

    class Meta:
        model = Payment
        fields = [
            "municipality_id", "payment_type", "description",
            "amount", "tax_amount", "penalty_amount",
            "mode", "property_id", "consumer_number", "period",
        ]

    def create(self, validated_data):
        from apps.municipalities.models import Municipality
        from django.utils import timezone
        municipality = Municipality.objects.get(id=validated_data.pop("municipality_id"))
        user = self.context["request"].user
        payment = Payment.objects.create(citizen=user, municipality=municipality, **validated_data)
        # Simulate instant success for UPI/card (in production: call payment gateway)
        payment.status = Payment.SUCCESS
        payment.paid_at = timezone.now()
        payment.save()
        return payment
