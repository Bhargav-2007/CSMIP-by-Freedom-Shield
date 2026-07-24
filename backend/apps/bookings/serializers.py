from rest_framework import serializers
from .models import Facility, Booking


class FacilitySerializer(serializers.ModelSerializer):
    municipality_name = serializers.CharField(source="municipality.name", read_only=True)

    class Meta:
        model = Facility
        fields = [
            "id", "name", "facility_type", "description", "location",
            "capacity", "hourly_rate", "daily_rate", "amenities",
            "image", "municipality_name", "is_active",
        ]


class BookingListSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source="facility.name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "booking_number", "facility_name", "purpose",
            "start_date", "end_date", "total_amount", "status", "created_at"
        ]


class BookingDetailSerializer(serializers.ModelSerializer):
    facility = FacilitySerializer(read_only=True)
    citizen_name = serializers.CharField(source="citizen.full_name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id", "booking_number", "citizen_name", "facility",
            "purpose", "attendees", "start_date", "end_date",
            "start_time", "end_time", "total_amount", "status", "notes", "created_at"
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    facility_id = serializers.UUIDField()

    class Meta:
        model = Booking
        fields = ["facility_id", "purpose", "attendees", "start_date", "end_date", "start_time", "end_time", "notes"]

    def create(self, validated_data):
        facility = Facility.objects.get(id=validated_data.pop("facility_id"))
        user = self.context["request"].user
        days = (validated_data["end_date"] - validated_data["start_date"]).days or 1
        total = facility.daily_rate * days
        return Booking.objects.create(citizen=user, facility=facility, total_amount=total, **validated_data)
