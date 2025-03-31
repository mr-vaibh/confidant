from django.contrib import admin
from .models import APIUsageLog, BillingPlan, UserBilling

@admin.register(APIUsageLog)
class APIUsageLogAdmin(admin.ModelAdmin):
    list_display = ("user", "api_name", "request_count", "month", "year", "last_used")
    list_filter = ("month", "year", "api_name")
    search_fields = ("user__username", "api_name")
    ordering = ("-year", "-month", "-request_count")

@admin.register(BillingPlan)
class BillingPlanAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "api_call_limit", "secrets_limit")
    search_fields = ("name",)
    list_filter = ("price",)

@admin.register(UserBilling)
class UserBillingAdmin(admin.ModelAdmin):
    list_display = ("user", "plan", "api_calls_used", "secrets_used", "next_billing_date", "last_billed_month")
    search_fields = ("user__username", "plan__name")
    list_filter = ("plan", "next_billing_date")