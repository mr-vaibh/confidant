from django.urls import path
from .views import APIUsageMonthlyReportView

urlpatterns = [
    path('api-usage-monthly/', APIUsageMonthlyReportView.as_view(), name='api-usage-monthly'),
]
