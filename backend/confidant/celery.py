import os
from celery import Celery

# Set default Django settings for Celery
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "confidant.settings")

app = Celery("confidant")

# Load settings from Django settings.py, using a "CELERY_" namespace
app.config_from_object("django.conf:settings", namespace="CELERY")

# Autodiscover tasks from installed apps
app.autodiscover_tasks()
