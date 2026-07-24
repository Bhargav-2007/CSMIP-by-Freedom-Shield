from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import RTIRequest, RTIAppeal, RTIDocument, RTITimeline
from .serializers import (
    RTIRequestSerializer,
    RTIAppealSerializer, 
    RTIDocumentSerializer,
    RTITimelineSerializer,
    RTIRequestCreateSerializer,
    RTIAppealCreateSerializer
)


class RTIRequestViewSet(viewsets.ModelViewSet):
    serializer_class = RTIRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'authority_type', 'department']
    search_fields = ['rti_number', 'subject', 'information_sought']
    ordering_fields = ['created_at', 'response_due_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            # Citizens can only see their own RTI requests
            return RTIRequest.objects.filter(citizen=user)
        elif user.role == 'officer':
            # Officers can see RTIs from their municipality
            return RTIRequest.objects.filter(municipality=user.municipality)
        elif user.role == 'admin':
            # Admins can see all RTIs
            return RTIRequest.objects.all()
        return RTIRequest.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RTIRequestCreateSerializer
        return RTIRequestSerializer
    
    def perform_create(self, serializer):
        # Set citizen and municipality for new RTI request
        serializer.save(
            citizen=self.request.user,
            municipality=self.request.user.municipality
        )
        
        # Create timeline entry
        rti_request = serializer.instance
        RTITimeline.objects.create(
            rti_request=rti_request,
            action="RTI Request Submitted",
            description=f"RTI request {rti_request.rti_number} has been submitted for processing.",
            actor=self.request.user,
            actor_role=self.request.user.role
        )
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def assign_officer(self, request, pk=None):
        """Assign an officer to handle this RTI request (Admin/Officer only)."""
        rti_request = self.get_object()
        
        if request.user.role not in ['admin', 'officer']:
            return Response(
                {"error": "Only administrators and officers can assign RTI requests."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        officer_id = request.data.get('officer_id')
        if not officer_id:
            return Response(
                {"error": "officer_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from apps.accounts.models import User
            officer = User.objects.get(id=officer_id, role='officer')
            rti_request.assigned_officer = officer
            rti_request.status = 'under_review'
            rti_request.save()
            
            # Create timeline entry
            RTITimeline.objects.create(
                rti_request=rti_request,
                action="Officer Assigned",
                description=f"RTI request assigned to {officer.full_name}.",
                actor=request.user,
                actor_role=request.user.role
            )
            
            return Response({"message": "Officer assigned successfully."})
        except User.DoesNotExist:
            return Response(
                {"error": "Officer not found."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def provide_response(self, request, pk=None):
        """Provide response to RTI request (Officer/Admin only)."""
        rti_request = self.get_object()
        
        if request.user.role not in ['admin', 'officer']:
            return Response(
                {"error": "Only officers and administrators can provide RTI responses."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        response_text = request.data.get('response_text')
        if not response_text:
            return Response(
                {"error": "response_text is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rti_request.response_text = response_text
        rti_request.status = 'information_provided'
        from django.utils import timezone
        rti_request.responded_at = timezone.now()
        rti_request.save()
        
        # Create timeline entry
        RTITimeline.objects.create(
            rti_request=rti_request,
            action="Information Provided",
            description="RTI response has been provided to the citizen.",
            actor=request.user,
            actor_role=request.user.role
        )
        
        return Response({"message": "Response provided successfully."})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reject_request(self, request, pk=None):
        """Reject RTI request (Officer/Admin only)."""
        rti_request = self.get_object()
        
        if request.user.role not in ['admin', 'officer']:
            return Response(
                {"error": "Only officers and administrators can reject RTI requests."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        rejection_reason = request.data.get('rejection_reason')
        if not rejection_reason:
            return Response(
                {"error": "rejection_reason is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rti_request.rejection_reason = rejection_reason
        rti_request.status = 'rejected'
        from django.utils import timezone
        rti_request.responded_at = timezone.now()
        rti_request.save()
        
        # Create timeline entry
        RTITimeline.objects.create(
            rti_request=rti_request,
            action="Request Rejected",
            description=f"RTI request has been rejected. Reason: {rejection_reason}",
            actor=request.user,
            actor_role=request.user.role
        )
        
        return Response({"message": "RTI request rejected."})


class RTIAppealViewSet(viewsets.ModelViewSet):
    serializer_class = RTIAppealSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['appeal_type', 'status']
    search_fields = ['appeal_number', 'grounds_for_appeal']
    ordering_fields = ['created_at', 'response_due_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            # Citizens can only see appeals for their own RTI requests
            return RTIAppeal.objects.filter(original_rti__citizen=user)
        elif user.role == 'officer':
            # Officers can see appeals from their municipality
            return RTIAppeal.objects.filter(original_rti__municipality=user.municipality)
        elif user.role == 'admin':
            # Admins can see all appeals
            return RTIAppeal.objects.all()
        return RTIAppeal.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RTIAppealCreateSerializer
        return RTIAppealSerializer
    
    def perform_create(self, serializer):
        # Save the appeal
        appeal = serializer.save()
        
        # Update original RTI status
        original_rti = appeal.original_rti
        if appeal.appeal_type == 'first_appeal':
            original_rti.status = 'first_appeal'
        else:
            original_rti.status = 'second_appeal'
        original_rti.save()
        
        # Create timeline entries
        RTITimeline.objects.create(
            rti_appeal=appeal,
            action=f"{appeal.get_appeal_type_display()} Filed",
            description=f"{appeal.get_appeal_type_display()} has been filed for RTI {original_rti.rti_number}.",
            actor=self.request.user,
            actor_role=self.request.user.role
        )
        
        RTITimeline.objects.create(
            rti_request=original_rti,
            action=f"{appeal.get_appeal_type_display()} Filed",
            description=f"Citizen has filed {appeal.get_appeal_type_display()} - {appeal.appeal_number}.",
            actor=self.request.user,
            actor_role=self.request.user.role
        )


class RTIDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = RTIDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            # Citizens can only see documents for their own RTI requests/appeals
            return RTIDocument.objects.filter(
                Q(rti_request__citizen=user) | Q(rti_appeal__original_rti__citizen=user)
            )
        elif user.role == 'officer':
            # Officers can see documents from their municipality
            return RTIDocument.objects.filter(
                Q(rti_request__municipality=user.municipality) | 
                Q(rti_appeal__original_rti__municipality=user.municipality)
            )
        elif user.role == 'admin':
            # Admins can see all documents
            return RTIDocument.objects.all()
        return RTIDocument.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class RTITimelineViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RTITimelineSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'citizen':
            # Citizens can only see timeline for their own RTI requests/appeals
            return RTITimeline.objects.filter(
                Q(rti_request__citizen=user) | Q(rti_appeal__original_rti__citizen=user)
            )
        elif user.role == 'officer':
            # Officers can see timeline from their municipality
            return RTITimeline.objects.filter(
                Q(rti_request__municipality=user.municipality) | 
                Q(rti_appeal__original_rti__municipality=user.municipality)
            )
        elif user.role == 'admin':
            # Admins can see all timeline entries
            return RTITimeline.objects.all()
        return RTITimeline.objects.none()