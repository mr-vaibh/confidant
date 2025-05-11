import random
import string
import secrets
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.tokens import default_token_generator
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

CATEGORY_CHOICES = [
    ('success', 'Success'),
    ('info', 'Information'),
    ('warning', 'Warning'),
    ('alert', 'Alert'),
]

def generate_random_username(length=4):
    """Generate a random string of letters and digits."""
    characters = string.ascii_lowercase + string.digits
    return ''.join(random.choices(characters, k=length))

def generate_api_key(user):
    user.api_key = secrets.token_hex(32)
    user.save()
    return user.api_key

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, default=generate_random_username, unique=True, blank=False, null=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Email and password are required by default.

    objects = UserManager()

    def __str__(self):
        return self.email
    
    def check_activation_token(self, token):
        return default_token_generator.check_token(self, token)

# `user_obj` is by default the email of the User
class Profile(models.Model):
    user_obj = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    organization_name = models.CharField(max_length=100, blank=False, null=False)
    public_key = models.TextField(blank=True, null=True)  # 🔥 Added public key field
    
    def __str__(self):
        return f'{self.user_obj.username} Profile'
    
    def push_notification(self, message, description='', url=None):
        """Method to create a new notification for this profile."""
        notification = Notification(
            profile=self,
            message=message,
            description=description,
            url=url
        )
        notification.save()

class Notification(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='info')
    url = models.URLField(blank=True, default='')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
    
    def mark_as_read(self):
        self.is_read = True
        self.read_at = timezone.now()
        self.save()

    def mark_as_unread(self):
        self.is_read = False
        self.read_at = None
        self.save()
    
    def mark_all_as_read(self, user):
        notifications = Notification.objects.filter(profile__user_obj=user, is_read=False)
        notifications.update(is_read=True)
    
    def unread_count(self, user):
        return Notification.objects.filter(profile__user_obj=user, is_read=False).count()

    def __str__(self):
        return f"Notification for {self.profile.user_obj.username}: {self.message}"