from django.contrib import admin
from .models import Profile

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile, Notification

class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'username', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(User, UserAdmin)


class ProfileAdmin(admin.ModelAdmin):
    list_display = ('profile_email', 'organization_name', 'profile_username')

    def profile_email(self, obj):
        return obj.user_obj.email
    profile_email.short_description = 'Email'

    def profile_username(self, obj):
        return obj.user_obj.username
    profile_username.short_description = 'Username'

    def has_delete_permission(self, request, obj=None):
        return False  # Disable the delete action for Profile

admin.site.register(Profile, ProfileAdmin)

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('profile', 'message', 'is_read', 'created_at')
    search_fields = ('profile__user_obj__email', 'message')
    list_filter = ('profile', 'is_read')
admin.site.register(Notification, NotificationAdmin)