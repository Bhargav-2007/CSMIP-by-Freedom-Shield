from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema
import hashlib
import random
from datetime import timedelta

from .models import User, OTPVerification
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
    MobileLoginSerializer,
    AadhaarVerificationSerializer,
    ProfileUpdateSerializer,
)


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — Create a new citizen or officer account."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=["Auth"])
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Issue tokens immediately on registration
        refresh = RefreshToken.for_user(user)
        refresh["role"] = user.role
        refresh["full_name"] = user.full_name
        refresh["display_id"] = user.display_id

        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — Obtain JWT access + refresh tokens."""
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=["Auth"])
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Update last_login_at
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(email=request.data.get("email"))
                user.last_login_at = timezone.now()
                user.save(update_fields=["last_login_at"])
                response.data["user"] = UserSerializer(user).data
            except User.DoesNotExist:
                pass
        return response


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/me/ — Retrieve or update the current user's profile."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Auth"])
    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProfileUpdateSerializer
        return UserSerializer


class LogoutView(APIView):
    """POST /api/auth/logout/ — Blacklist the refresh token."""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Auth"])
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/ — Change the authenticated user's password."""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Auth"])
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Password changed successfully."})


class SendOTPView(APIView):
    """POST /api/auth/send-otp/ — Send OTP to mobile number."""
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=["Auth"])
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        mobile = serializer.validated_data["mobile"]
        purpose = serializer.validated_data["purpose"]
        
        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        
        # Create OTP record
        otp_record = OTPVerification.objects.create(
            mobile=mobile,
            purpose=purpose,
            otp_hash=hashlib.sha256(f"{otp}".encode()).hexdigest(),
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        # In production, send SMS via gateway
        # For development, we'll just return the OTP (remove in production)
        response_data = {
            "message": f"OTP sent to {mobile}",
            "expires_in": "10 minutes"
        }
        
        # Only include OTP in development mode
        from django.conf import settings
        if settings.DEBUG:
            response_data["otp"] = otp  # Remove this in production
        
        return Response(response_data, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """POST /api/auth/verify-otp/ — Verify OTP code."""
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=["Auth"])
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        return Response({
            "message": "OTP verified successfully",
            "mobile": serializer.validated_data["mobile"]
        }, status=status.HTTP_200_OK)


class MobileLoginView(APIView):
    """POST /api/auth/mobile-login/ — Login with mobile number and OTP."""
    permission_classes = [permissions.AllowAny]

    @extend_schema(tags=["Auth"])
    def post(self, request):
        serializer = MobileLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data["user"]
        
        # Update last login
        user.last_login_at = timezone.now()
        user.save(update_fields=["last_login_at"])
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        refresh["role"] = user.role
        refresh["full_name"] = user.full_name
        refresh["display_id"] = user.display_id
        
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)


class AadhaarVerifyView(APIView):
    """POST /api/auth/aadhaar-verify/ — Verify Aadhaar for eKYC."""
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(tags=["Auth"])
    def post(self, request):
        serializer = AadhaarVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # In production, integrate with UIDAI eKYC APIs
        # For now, we'll mock the verification
        
        user = request.user
        user.aadhaar_last4 = serializer.validated_data["aadhaar_number"][-4:]
        user.is_verified = True
        user.save(update_fields=["aadhaar_last4", "is_verified"])
        
        return Response({
            "message": "Aadhaar verification successful",
            "is_verified": True,
            "name": serializer.validated_data["name"],
            "address": serializer.validated_data["address"]
        }, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    """GET /api/auth/users/ — List users (Admin only)."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'officer':
            # Officers can see users from their municipality
            return User.objects.filter(municipality=user.municipality)
        return User.objects.none()


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/auth/users/<id>/ — User management (Admin only)."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'officer':
            return User.objects.filter(municipality=user.municipality)
        return User.objects.none()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def resend_verification_email(request):
    """Resend verification email for user account."""
    if not request.user.is_verified:
        # In production, send verification email
        return Response({"message": "Verification email sent"}, status=status.HTTP_200_OK)
    return Response({"message": "Account already verified"}, status=status.HTTP_400_BAD_REQUEST)
