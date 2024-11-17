# keys/admin.py
from django.contrib import admin
from .models import UserPublicKey

admin.site.register(UserPublicKey)