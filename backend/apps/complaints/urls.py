from django.urls import path
from .views import (
    ComplaintListCreateView,
    ComplaintDetailView,
    ComplaintStatusUpdateView,
    ComplaintAddUpdateView,
    ComplaintMediaUploadView,
    TrackComplaintView,
)

urlpatterns = [
    path("", ComplaintListCreateView.as_view(), name="complaint-list"),
    path("track/<str:complaint_number>/", TrackComplaintView.as_view(), name="complaint-track"),
    path("<uuid:pk>/", ComplaintDetailView.as_view(), name="complaint-detail"),
    path("<uuid:pk>/status/", ComplaintStatusUpdateView.as_view(), name="complaint-status"),
    path("<uuid:pk>/updates/", ComplaintAddUpdateView.as_view(), name="complaint-add-update"),
    path("<uuid:pk>/media/", ComplaintMediaUploadView.as_view(), name="complaint-media-upload"),
]
