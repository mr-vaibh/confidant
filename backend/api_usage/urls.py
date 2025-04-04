from django.urls import path
from .views import APIUsageMonthlyReportView, UserBillingInfoView

urlpatterns = [
    path('monthly-usage/', APIUsageMonthlyReportView.as_view(), name='monthly-usage'),
    path('billing-overview/', UserBillingInfoView.as_view(), name='billing-overview'),
]
