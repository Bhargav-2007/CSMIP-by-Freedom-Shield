import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.municipalities.models import Department, Municipality
from apps.services.models import Service


@pytest.fixture
def api_client():
    return APIClient(HTTP_HOST="localhost")


@pytest.fixture
def municipality():
    return Municipality.objects.create(
        name="Ahmedabad Municipal Corporation",
        short_name="AMC",
        slug="ahmedabad",
        state="Gujarat",
        supported_languages=["en", "hi", "gu"],
    )


@pytest.fixture
def service(municipality):
    department = Department.objects.create(
        municipality=municipality,
        name="Health Department",
        code="HEALTH",
    )
    return Service.objects.create(
        municipality=municipality,
        department=department,
        name="Birth Certificate",
        slug="birth-certificate",
        category=Service.CERTIFICATE,
        description="Apply for a birth certificate online.",
        fee=50,
    )


@pytest.mark.django_db
def test_public_catalog_endpoints(api_client, municipality, service):
    municipalities_response = api_client.get("/api/municipalities/")
    assert municipalities_response.status_code == 200
    assert municipalities_response.data["results"][0]["slug"] == municipality.slug

    services_response = api_client.get("/api/services/")
    assert services_response.status_code == 200
    assert services_response.data["results"][0]["slug"] == service.slug


@pytest.mark.django_db
def test_registration_returns_tokens_and_profile(api_client):
    response = api_client.post(
        "/api/auth/register/",
        {
            "email": "citizen@example.com",
            "password": "G0vPortal!782",
            "confirm_password": "G0vPortal!782",
            "full_name": "Test Citizen",
            "mobile": "9876543210",
            "role": "citizen",
        },
        format="json",
    )

    assert response.status_code == 201
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data["user"]["email"] == "citizen@example.com"


@pytest.mark.django_db
def test_protected_endpoint_requires_authentication(api_client):
    response = api_client.get("/api/auth/me/")
    assert response.status_code == 401


@pytest.mark.django_db
def test_openapi_schema_is_available(api_client):
    response = api_client.get("/api/schema/")
    assert response.status_code == 200
    assert "openapi" in response.data
