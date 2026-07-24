"""
CivicHub URL configuration.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Admin
    path("django-admin/", admin.site.urls),

    # API v1
    path("api/auth/", include("apps.accounts.urls")),
    path("api/applications/", include("apps.applications.urls")),
    path("api/complaints/", include("apps.complaints.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/services/", include("apps.services.urls")),
    path("api/municipalities/", include("apps.municipalities.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/documents/", include("apps.documents.urls")),
    path("api/bookings/", include("apps.bookings.urls")),
    path("api/rti/", include("apps.rti.urls")),

    # API Schema & Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
