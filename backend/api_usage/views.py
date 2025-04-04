from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import APIUsageLog, UserBilling

class APIUsageMonthlyReportView(APIView):
    """
    View to get API usage reports.
    - Admin users can see all usage data.
    - Regular users can only see their own usage data.
    """
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # If admin, fetch all users' usage data, else only fetch the current user's data
        usage_query = APIUsageLog.objects.values("api_name", "month", "year").annotate(
            total_requests=Sum("request_count")
        ).order_by("year", "month")

        if not user.is_staff:  # Regular user
            usage_query = usage_query.filter(user=user)

        # Convert months into readable format for frontend
        month_names = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
            7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
        }

        usage_data = [
            {"month": f"{month_names[item['month']]} {str(item['year'])}", "net_usage": item["total_requests"]}
            for item in usage_query
        ]


        return Response({"monthly_usage_report": usage_data})

class UserBillingInfoView(APIView):
    """Returns the current user's billing details (plan, next billing date, and price)."""
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        try:
            user_billing = UserBilling.objects.select_related("plan").get(user=user)
            plan_name = user_billing.plan.name if user_billing.plan else "No Plan"
            plan_price = user_billing.plan.price if user_billing.plan else 0.00
            next_billing_date = user_billing.next_billing_date.strftime("%Y-%m-%d") if user_billing.next_billing_date else "N/A"

            return Response({
                "current_plan": plan_name,
                "plan_price": float(plan_price),  # Convert to float for JSON compatibility
                "next_billing_date": next_billing_date
            })
        
        except UserBilling.DoesNotExist:
            return Response({"error": "User billing info not found."}, status=404)