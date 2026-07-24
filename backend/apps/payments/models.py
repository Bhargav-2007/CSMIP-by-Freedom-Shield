import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Payment(models.Model):
    """Municipal payment record — property tax, water bill, trade license fee, etc."""
    PROPERTY_TAX = "property_tax"
    WATER_BILL = "water_bill"
    DRAINAGE = "drainage"
    PROFESSIONAL_TAX = "professional_tax"
    TRADE_LICENSE = "trade_license"
    MISC = "miscellaneous"
    TYPE_CHOICES = [
        (PROPERTY_TAX, "Property Tax"),
        (WATER_BILL, "Water Bill"),
        (DRAINAGE, "Drainage Bill"),
        (PROFESSIONAL_TAX, "Professional Tax"),
        (TRADE_LICENSE, "Trade License Fee"),
        (MISC, "Miscellaneous"),
    ]

    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (SUCCESS, "Success"),
        (FAILED, "Failed"),
        (REFUNDED, "Refunded"),
    ]

    UPI = "upi"
    NET_BANKING = "net_banking"
    CARD = "card"
    CASH = "cash"
    CHEQUE = "cheque"
    MODE_CHOICES = [
        (UPI, "UPI"),
        (NET_BANKING, "Net Banking"),
        (CARD, "Debit / Credit Card"),
        (CASH, "Cash"),
        (CHEQUE, "Cheque"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_id = models.CharField(max_length=100, unique=True)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    municipality = models.ForeignKey("municipalities.Municipality", on_delete=models.CASCADE, related_name="payments")

    payment_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    description = models.CharField(max_length=500)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    penalty_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default=UPI)
    gateway_response = models.JSONField(default=dict, blank=True)

    # Property / account details
    property_id = models.CharField(max_length=100, blank=True, help_text="Property ID for property tax")
    consumer_number = models.CharField(max_length=100, blank=True, help_text="Water/electricity consumer number")
    period = models.CharField(max_length=50, blank=True, help_text="Billing period e.g. Q1 2024-25")

    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.transaction_id} — ₹{self.total_amount}"

    def save(self, *args, **kwargs):
        if not self.transaction_id:
            import random, datetime
            ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
            self.transaction_id = f"TXN{ts}{random.randint(100, 999)}"
        if not self.total_amount:
            self.total_amount = self.amount + self.tax_amount + self.penalty_amount
        super().save(*args, **kwargs)
