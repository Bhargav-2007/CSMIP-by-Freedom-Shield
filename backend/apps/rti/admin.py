from django.contrib import admin
from .models import RTIRequest, RTIAppeal, RTIDocument, RTITimeline


@admin.register(RTIRequest)
class RTIRequestAdmin(admin.ModelAdmin):
    list_display = ['rti_number', 'citizen', 'subject', 'status', 'authority_type', 'created_at', 'response_due_date']
    list_filter = ['status', 'authority_type', 'municipality', 'created_at']
    search_fields = ['rti_number', 'subject', 'citizen__full_name', 'citizen__email']
    readonly_fields = ['rti_number', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Request Information', {
            'fields': ('rti_number', 'citizen', 'municipality', 'subject', 'information_sought')
        }),
        ('Authority & Department', {
            'fields': ('authority_type', 'department', 'assigned_officer')
        }),
        ('Status & Response', {
            'fields': ('status', 'response_text', 'rejection_reason')
        }),
        ('Fees', {
            'fields': ('fees_paid', 'fees_exemption_reason')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'submitted_at', 'response_due_date', 'responded_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RTIAppeal)
class RTIAppealAdmin(admin.ModelAdmin):
    list_display = ['appeal_number', 'original_rti', 'appeal_type', 'status', 'created_at', 'response_due_date']
    list_filter = ['appeal_type', 'status', 'created_at']
    search_fields = ['appeal_number', 'original_rti__rti_number', 'grounds_for_appeal']
    readonly_fields = ['appeal_number', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(RTIDocument)
class RTIDocumentAdmin(admin.ModelAdmin):
    list_display = ['document_name', 'document_type', 'rti_request', 'rti_appeal', 'uploaded_by', 'uploaded_at']
    list_filter = ['document_type', 'uploaded_at']
    search_fields = ['document_name', 'rti_request__rti_number', 'rti_appeal__appeal_number']


@admin.register(RTITimeline)
class RTITimelineAdmin(admin.ModelAdmin):
    list_display = ['action', 'rti_request', 'rti_appeal', 'actor', 'timestamp']
    list_filter = ['action', 'actor_role', 'timestamp']
    readonly_fields = ['timestamp']
    date_hierarchy = 'timestamp'