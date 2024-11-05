# permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrOwner(BasePermission):
    """
    Custom permission to allow users to access and modify only their own variables,
    while admin users have full access.
    """

    def has_object_permission(self, request, view, obj):
        # Allow read-only access for safe methods (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True

        # Allow full access for admin users
        if request.user.is_staff:
            return True

        # Allow access for the owner of the object
        return obj.created_by == request.user
