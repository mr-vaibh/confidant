from django.conf import settings
from django.db import models

class UserPublicKey(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    public_key = models.TextField()  # To store the RSA public key
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Public Key for {self.user.username}"
