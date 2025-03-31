from celery import shared_task
from datetime import datetime
from django.utils.timezone import now
from .models import UserBilling

@shared_task
def reset_monthly_usage():
    """Reset API usage for all users at the start of the billing cycle."""
    UserBilling.objects.update(api_calls_used=0, secrets_used=0, next_billing_date=now())
    return f"Billing reset on {datetime.now()}"
