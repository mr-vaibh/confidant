import hashlib
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from .models import APIUsageLog, UserBilling, BillingPlan
from keys.models import UserPublicKey

User = get_user_model()

class APIUsageTrackingMiddleware:
    """
    Middleware to track API usage per month and verify API keys.
    Also checks if the user has an active billing plan and has not exceeded their usage quota.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.trackable_apis = {
            "/api/get-sdk-keys/": "EncryptEnvironmentVariablesView",
        }

    def __call__(self, request):
        response = self.get_response(request)

        # Check if the request path is in trackable APIs
        api_name = self.trackable_apis.get(request.path)
        if not api_name:
            return response  # Skip if API is not trackable

        user = self.authenticate_user(request)
        if isinstance(user, JsonResponse):  # If authentication fails, return the error response
            return user

        billing = self.get_or_create_billing(user)  # Ensure billing exists
        if isinstance(billing, JsonResponse):  # If billing check fails, return the error response
            return billing

        usage_check = self.check_usage_limits(billing)
        if isinstance(usage_check, JsonResponse):  # If usage limit is exceeded, return error
            return usage_check

        self.log_api_usage(user, api_name, billing)
        return response

    def authenticate_user(self, request):
        """
        Authenticates the user by verifying the provided API key and public key hash.
        """
        username = request.headers.get("X-Username")
        received_public_key_hash = request.headers.get("X-Public-Key-Hash")

        if not username or not received_public_key_hash:
            return self.error_response("Missing authentication headers", 401)

        try:
            user = User.objects.get(username=username)
            stored_public_key = UserPublicKey.objects.get(user=user).public_key
            expected_public_key_hash = hashlib.sha256(stored_public_key.encode()).hexdigest()

            if expected_public_key_hash != received_public_key_hash:
                return self.error_response("Invalid public key hash", 403)

            return user  # Return authenticated user

        except ObjectDoesNotExist:
            return self.error_response("Invalid API Key", 403)

    def get_or_create_billing(self, user):
        """
        Ensures that the user has an active billing record.
        If missing, it will return an error response.
        """
        billing, created = UserBilling.objects.get_or_create(user=user)

        if not billing.plan:
            return self.error_response("No active billing plan found. Please subscribe to a plan.", 403)

        # Auto-reset usage if billing cycle changed
        if billing.is_billing_due():
            billing.charge_user()

        return billing

    def check_usage_limits(self, billing):
        """
        Checks if the user has exceeded their API usage quota.
        """
        if billing.has_exceeded_limit():
            return self.error_response("API usage limit exceeded for this month.", 403)

        # Additional check for Free plan users
        if billing.plan.name == "Free" and billing.api_calls_used >= billing.plan.api_call_limit:
            return self.error_response("Free plan API limit reached. Upgrade to continue.", 403)

    def log_api_usage(self, user, api_name, billing):
        """
        Logs API usage and updates the UserBilling record.
        """
        current_time = now()
        usage_log, _ = APIUsageLog.objects.get_or_create(
            user=user,
            api_name=api_name,
            month=current_time.month,
            year=current_time.year
        )
        usage_log.request_count += 1
        usage_log.last_used = current_time
        usage_log.save()

        # Update API usage count efficiently
        UserBilling.objects.filter(user=user).update(api_calls_used=billing.api_calls_used + 1)

    def error_response(self, message, status):
        """
        Returns a standardized JSON error response.
        """
        return JsonResponse({"error": message}, status=status)
