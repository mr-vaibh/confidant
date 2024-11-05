from django.db import models
from django.conf import settings

class EnvironmentVariable(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_vars"
    )
    latest_version = models.OneToOneField(
        'VariableVersion',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="latest_for_variable"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Environment Variable"
        verbose_name_plural = "Environment Variables"

    def __str__(self):
        return f"{self.name} (Latest version: {self.latest_version.version if self.latest_version else 'None'})"


class VariableVersion(models.Model):
    variable = models.ForeignKey(
        EnvironmentVariable,
        on_delete=models.CASCADE,
        related_name="versions"
    )
    version = models.CharField(max_length=10, blank=True)
    value = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_versions"
    )

    class Meta:
        unique_together = ('variable', 'version')
        ordering = ['-created_at']
        verbose_name = "Variable Version"
        verbose_name_plural = "Variable Versions"

    def save(self, *args, **kwargs):
        # Automatically generate the version if not provided
        if not self.version:
            # Find the highest existing version number for this variable
            latest_version = VariableVersion.objects.filter(variable=self.variable).order_by('-id').first()
            if latest_version:
                # Increment based on the last version
                last_version = latest_version.version
                version_num = int(last_version.split("v")[-1]) + 1
                self.version = f"v{version_num}"
            else:
                # Default to "v1" if no previous version exists
                self.version = "v1"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.variable.name} v{self.version}"
