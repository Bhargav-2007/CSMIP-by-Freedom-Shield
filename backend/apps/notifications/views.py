from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """GET /api/notifications/ — User's notifications, newest first."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Notifications"])
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@extend_schema(tags=["Notifications"])
def mark_all_read(request):
    """POST /api/notifications/mark-read/ — Mark all notifications as read."""
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({"detail": "All notifications marked as read."})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, pk):
    """POST /api/notifications/{id}/read/ — Mark a single notification as read."""
    Notification.objects.filter(pk=pk, user=request.user).update(is_read=True)
    return Response({"detail": "Notification marked as read."})
