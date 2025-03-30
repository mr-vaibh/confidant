from django.contrib import admin
from .models import APIUsageLog

@admin.register(APIUsageLog)
class APIUsageLogAdmin(admin.ModelAdmin):
    list_display = ("user", "api_name", "request_count", "month", "year", "last_used")
    list_filter = ("month", "year", "api_name")
    search_fields = ("user__username", "api_name")
    ordering = ("-year", "-month", "-request_count")
