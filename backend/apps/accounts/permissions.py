from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied


class IsCitizen(permissions.BasePermission):
    """Permission class to allow access only to citizens."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'citizen'
        )


class IsOfficer(permissions.BasePermission):
    """Permission class to allow access only to municipal officers."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'officer'
        )


class IsAdmin(permissions.BasePermission):
    """Permission class to allow access only to administrators."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )


class IsOfficerOrAdmin(permissions.BasePermission):
    """Permission class to allow access to officers and administrators."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['officer', 'admin']
        )


class IsCitizenOrOfficer(permissions.BasePermission):
    """Permission class to allow access to citizens and officers."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['citizen', 'officer']
        )


class IsVerifiedUser(permissions.BasePermission):
    """Permission class to allow access only to KYC-verified users."""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_verified
        )


class IsSameMunicipality(permissions.BasePermission):
    """Permission class to ensure users can only access data from their municipality."""
    
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        # Admins can access all municipalities
        if request.user.role == 'admin':
            return True
            
        # Officers and citizens need municipality assignment
        return request.user.municipality is not None
    
    def has_object_permission(self, request, view, obj):
        # Admins can access any object
        if request.user.role == 'admin':
            return True
        
        # Check if object belongs to user's municipality
        if hasattr(obj, 'municipality'):
            return obj.municipality == request.user.municipality
        
        # Check if object belongs to user's municipality via related field
        if hasattr(obj, 'citizen') and hasattr(obj.citizen, 'municipality'):
            return obj.citizen.municipality == request.user.municipality
        
        # Check if object is the user's own record
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # For user objects themselves
        if obj == request.user:
            return True
        
        return False


class IsOwnerOrOfficer(permissions.BasePermission):
    """Permission class to allow access to object owners or municipal officers."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admins can access any object
        if request.user.role == 'admin':
            return True
        
        # Officers can access objects from their municipality
        if request.user.role == 'officer':
            if hasattr(obj, 'municipality'):
                return obj.municipality == request.user.municipality
            if hasattr(obj, 'citizen') and hasattr(obj.citizen, 'municipality'):
                return obj.citizen.municipality == request.user.municipality
        
        # Citizens can only access their own objects
        if request.user.role == 'citizen':
            if hasattr(obj, 'citizen'):
                return obj.citizen == request.user
            if hasattr(obj, 'user'):
                return obj.user == request.user
            if obj == request.user:
                return True
        
        return False


class CanModifyApplication(permissions.BasePermission):
    """Permission for modifying applications based on status and role."""
    
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        # Admins can modify any application
        if request.user.role == 'admin':
            return True
        
        # Officers can modify applications from their municipality
        if request.user.role == 'officer':
            if hasattr(obj, 'municipality') and obj.municipality == request.user.municipality:
                return True
        
        # Citizens can only modify their own applications if status allows
        if request.user.role == 'citizen':
            if hasattr(obj, 'citizen') and obj.citizen == request.user:
                # Citizens can modify only submitted applications
                if hasattr(obj, 'status'):
                    return obj.status in ['submitted', 'under_review']
        
        return False


def check_municipality_access(user, target_municipality):
    """Helper function to check if user can access a specific municipality."""
    if not user.is_authenticated:
        return False
    
    if user.role == 'admin':
        return True
    
    if user.municipality and user.municipality == target_municipality:
        return True
    
    return False


def get_user_municipalities(user):
    """Helper function to get municipalities accessible by user."""
    from apps.municipalities.models import Municipality
    
    if not user.is_authenticated:
        return Municipality.objects.none()
    
    if user.role == 'admin':
        return Municipality.objects.all()
    
    if user.municipality:
        return Municipality.objects.filter(id=user.municipality.id)
    
    return Municipality.objects.none()