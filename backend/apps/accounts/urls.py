from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    LoginView, 
    MeView, 
    LogoutView, 
    ChangePasswordView,
    SendOTPView,
    VerifyOTPView,
    MobileLoginView,
    AadhaarVerifyView,
    UserListView,
    UserDetailView,
    resend_verification_email,
)

urlpatterns = [
    # Standard Authentication
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("change-password/", ChangePasswordView.as_view(), name="auth-change-password"),
    
    # OTP-based Authentication
    path("send-otp/", SendOTPView.as_view(), name="auth-send-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="auth-verify-otp"),
    path("mobile-login/", MobileLoginView.as_view(), name="auth-mobile-login"),
    
    # eKYC & Verification
    path("aadhaar-verify/", AadhaarVerifyView.as_view(), name="auth-aadhaar-verify"),
    path("resend-verification/", resend_verification_email, name="auth-resend-verification"),
    
    # User Management (Admin)
    path("users/", UserListView.as_view(), name="auth-user-list"),
    path("users/<uuid:pk>/", UserDetailView.as_view(), name="auth-user-detail"),
]
