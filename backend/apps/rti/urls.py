from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RTIRequestViewSet, RTIAppealViewSet, RTIDocumentViewSet, RTITimelineViewSet

app_name = "rti"

router = DefaultRouter()
router.register(r"requests", RTIRequestViewSet, basename="rti-requests")
router.register(r"appeals", RTIAppealViewSet, basename="rti-appeals")  
router.register(r"documents", RTIDocumentViewSet, basename="rti-documents")
router.register(r"timeline", RTITimelineViewSet, basename="rti-timeline")

urlpatterns = [
    path("", include(router.urls)),
]