from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

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
