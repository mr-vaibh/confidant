from django.urls import path
from .views import APIUsageMonthlyReportView

urlpatterns = [
    path('monthly-usage/', APIUsageMonthlyReportView.as_view(), name='monthly-usage'),
]
