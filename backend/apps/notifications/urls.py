from django.urls import path
from .views import NotificationListView, mark_all_read, mark_notification_read

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("mark-read/", mark_all_read, name="notification-mark-all-read"),
    path("<uuid:pk>/read/", mark_notification_read, name="notification-mark-read"),
]
