from django.utils.timezone import now
from django.db.models.signals import post_save
from django.dispatch import receiver
from api_usage.models import UserBilling, BillingPlan
from .models import User, Profile

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user_obj=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=User)
def create_billing_record(sender, instance, created, **kwargs):
    if created:  # Only run when a new user is created
        free_plan = BillingPlan.objects.filter(name="Free").first()  # Get Free plan
        if free_plan:
            UserBilling.objects.create(
                user=instance,
                plan=free_plan,
                next_billing_date=now().replace(day=1),  # Set to next month start
            )