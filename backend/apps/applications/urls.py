from django.urls import path
from .views import (
    ApplicationListCreateView,
    ApplicationDetailView,
    ApplicationStatusUpdateView,
    TrackApplicationView,
)

urlpatterns = [
    path("", ApplicationListCreateView.as_view(), name="application-list"),
    path("track/<str:application_number>/", TrackApplicationView.as_view(), name="application-track"),
    path("<uuid:pk>/", ApplicationDetailView.as_view(), name="application-detail"),
    path("<uuid:pk>/status/", ApplicationStatusUpdateView.as_view(), name="application-status"),
]
