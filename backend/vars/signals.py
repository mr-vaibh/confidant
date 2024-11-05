# vars/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import VariableVersion, EnvironmentVariable

@receiver(post_save, sender=VariableVersion)
def update_latest_version(sender, instance, created, **kwargs):
    if created:
        # Set `latest_version` on the related EnvironmentVariable instance
        instance.variable.latest_version = instance
        instance.variable.save()
