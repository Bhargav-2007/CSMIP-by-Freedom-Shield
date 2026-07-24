from django.contrib import admin
from .models import Municipality, Department, Ward, Announcement


@admin.register(Municipality)
class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ["name", "state", "ulb_type", "is_active"]
    list_filter = ["state", "ulb_type", "is_active"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ["name", "municipality", "code", "is_active"]
    list_filter = ["municipality", "is_active"]
    search_fields = ["name", "code"]


@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = ["number", "name", "municipality", "zone"]
    list_filter = ["municipality"]
    search_fields = ["name", "zone"]


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["title", "municipality", "category", "is_emergency", "is_pinned", "published_at"]
    list_filter = ["municipality", "category", "is_emergency", "is_pinned"]
