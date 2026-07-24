import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Facility(models.Model):
    """Public facility that can be booked."""
    COMMUNITY_HALL = "community_hall"
    AUDITORIUM = "auditorium"
    SPORTS = "sports"
    PARK = "park"
    GUEST_HOUSE = "guest_house"
    MEETING_ROOM = "meeting_room"
    TYPE_CHOICES = [
        (COMMUNITY_HALL, "Community Hall"),
        (AUDITORIUM, "Auditorium"),
        (SPORTS, "Sports Facility"),
        (PARK, "Park"),
        (GUEST_HOUSE, "Guest House"),
        (MEETING_ROOM, "Meeting Room"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    municipality = models.ForeignKey("municipalities.Municipality", on_delete=models.CASCADE, related_name="facilities")
    name = models.CharField(max_length=255)
    facility_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=500)
    capacity = models.PositiveIntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    daily_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    amenities = models.JSONField(default=list)
    image = models.ImageField(upload_to="facilities/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "facilities"
        ordering = ["name"]


class Booking(models.Model):
    """Booking of a public facility."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (CONFIRMED, "Confirmed"),
        (CANCELLED, "Cancelled"),
        (COMPLETED, "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_number = models.CharField(max_length=50, unique=True)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name="bookings")
    purpose = models.CharField(max_length=500)
    attendees = models.PositiveIntegerField(default=1)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "bookings"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.booking_number:
            import random, datetime
            self.booking_number = f"BOOK-{datetime.datetime.now().year}-{random.randint(10000, 99999)}"
        super().save(*args, **kwargs)
