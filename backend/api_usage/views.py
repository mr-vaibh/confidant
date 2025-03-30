from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import APIUsageLog

class APIUsageMonthlyReportView(APIView):
    """
    Admin-only view to get API usage reports grouped by month.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Aggregate total requests per API per month
        usage_data = APIUsageLog.objects.values("api_name", "month", "year").annotate(
            total_requests=Sum("request_count")
        ).order_by("-year", "-month")

        return Response({"monthly_usage_report": list(usage_data)})
