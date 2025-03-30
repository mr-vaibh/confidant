import json
import hashlib
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from .models import APIUsageLog
from keys.models import UserPublicKey

User = get_user_model()

class APIUsageTrackingMiddleware:
    """
    Middleware to track API usage per month and verify API keys.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Only track specific APIs
        trackable_apis = {
            "/api/get-sdk-keys/": "EncryptEnvironmentVariablesView",
        }

        api_name = trackable_apis.get(request.path)
        if not api_name:
            return response  # Skip if API is not trackable

        current_time = now()
        username = request.headers.get("X-Username")
        received_public_key_hash = request.headers.get("X-Public-Key-Hash")

        # Validate API Key & Public Key Hash
        if not username or not received_public_key_hash:
            print(f"Security Alert: Missing authentication headers for {username}.")
            return JsonResponse({"error": "Missing authentication headers"}, status=401)

        user = None
        try:
            user = User.objects.get(username=username)
            user_public_key_object = UserPublicKey.objects.get(user=user)
            user_public_key = user_public_key_object.public_key

            # Compute SHA-256 hash of the stored public key
            expected_public_key_hash = hashlib.sha256(user_public_key.encode()).hexdigest()

            # Compare the received hash with the expected hash
            if expected_public_key_hash != received_public_key_hash:
                print(f"Security Alert: Public Key Hash Mismatch for {username}.")
                return JsonResponse({"error": "Invalid public key hash"}, status=403)

        except ObjectDoesNotExist:
            print(f"Security Alert: Invalid API Key for {username}.")
            return JsonResponse({"error": "Invalid API Key"}, status=403)

        # Authentication successful - Log API usage
        usage_log, _ = APIUsageLog.objects.get_or_create(
            user=user,
            api_name=api_name,
            month=current_time.month,
            year=current_time.year
        )

        usage_log.request_count += 1
        usage_log.last_used = current_time
        usage_log.save()

        return response
