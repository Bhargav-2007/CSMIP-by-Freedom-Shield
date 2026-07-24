from django.urls import path
from .views import MunicipalityListView, MunicipalityDetailView, AnnouncementListView

urlpatterns = [
    path("", MunicipalityListView.as_view(), name="municipality-list"),
    path("<slug:slug>/", MunicipalityDetailView.as_view(), name="municipality-detail"),
    path("<slug:slug>/announcements/", AnnouncementListView.as_view(), name="municipality-announcements"),
]
