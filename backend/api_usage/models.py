from django.db import models
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from datetime import timedelta

User = get_user_model()

FREE, BASIC, PRO = "Free", "Basic", "Pro"
PLAN_CHOICES = [
    (FREE, "Free"),
    (BASIC, "Basic"),
    (PRO, "Pro"),
]

class APIUsageLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    api_name = models.CharField(max_length=255)
    request_count = models.IntegerField(default=0)
    month = models.IntegerField()  # Stores the month (1-12)
    year = models.IntegerField()   # Stores the year (e.g., 2024)
    last_used = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('user', 'api_name', 'month', 'year')  # Ensures one record per user per month per API

    def __str__(self):
        return f"{self.user.username if self.user else 'Anonymous'} - {self.api_name} ({self.month}/{self.year}) - {self.request_count} requests"

class BillingPlan(models.Model):
    name = models.CharField(max_length=10, choices=PLAN_CHOICES, unique=True)  # Select choice field
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)  # Monthly price
    api_call_limit = models.IntegerField()  # API calls allowed
    secrets_limit = models.IntegerField()  # Stored secrets allowed
    team_members = models.IntegerField()  # Max team members
    version_history_limit = models.IntegerField(default=0)  # How long to retain history

    def __str__(self):
        return self.name

class UserBilling(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(BillingPlan, on_delete=models.SET_NULL, null=True)
    api_calls_used = models.IntegerField(default=0)
    secrets_used = models.IntegerField(default=0)
    next_billing_date = models.DateField()  # Auto-update every month
    last_billed_month = models.DateField(null=True, blank=True)  # Set only after first charge

    def is_billing_due(self) -> bool:
        """Check if the user should be charged this month."""
        return not self.last_billed_month or self.last_billed_month.month != now().month

    def charge_user(self):
        """Charge the user and update billing cycle."""
        if self.is_billing_due():
            # TODO: Implement actual payment processing logic
            # process_payment(self.user)

            today = now().date()
            # Set last billed month to today
            self.last_billed_month = today

            # Get first day of current month
            first_of_month = today.replace(day=1)
            # Add one month to get first day of next month
            if first_of_month.month == 12:
                # Handle December specially
                self.next_billing_date = first_of_month.replace(year=first_of_month.year + 1, month=1)
            else:
                self.next_billing_date = first_of_month.replace(month=first_of_month.month + 1)

            # Reset API & secret usage
            self.reset_usage()
            self.save()

    def upgrade_plan(self, new_plan):
        """Upgrade the user's plan."""
        self.plan = new_plan
        self.save()

    def reset_usage(self):
        """Reset API call and secret usage at the start of a new billing cycle."""
        self.api_calls_used = 0
        self.secrets_used = 0
        self.save()

    def has_exceeded_limit(self) -> bool:
        """Check if the user has exceeded their API or secret usage limits."""
        return (
            self.api_calls_used >= self.plan.api_call_limit
            or self.secrets_used >= self.plan.secrets_limit
        )

    def track_api_usage(self):
        """Increment API call count and check limits."""
        if self.has_exceeded_limit():
            raise ValueError("API limit exceeded")
        self.save()

    def can_change_plan(self):
        """Returns True if the user is allowed to change their plan (next cycle)."""
        return now().date() >= self.next_billing_date

    def change_plan(self, new_plan):
        """Handles plan change requests but only applies at next cycle."""
        if not self.can_change_plan():
            raise ValueError("You can only change your plan at the start of a new billing cycle.")
        self.plan = new_plan
        self.save()