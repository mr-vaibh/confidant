import random
import string
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _

def generate_random_username(length=4):
    """Generate a random string of letters and digits."""
    characters = string.ascii_lowercase + string.digits
    return ''.join(random.choices(characters, k=length))

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email)
        username = generate_random_username()
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Email and password are required by default.

    objects = UserManager()

    def save(self, *args, **kwargs):
        if not self.username:  # If username is not set
            self.username = generate_random_username()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

# `user_obj` is by default the email of the User
class Profile(models.Model):
    user_obj = models.OneToOneField(User, on_delete=models.CASCADE)
    organization_name = models.CharField(max_length=100, blank=False, null=False)

    def __str__(self):
        return f'{self.user_obj.username} Profile'
