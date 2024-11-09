# vars/mixins.py
from rest_framework.exceptions import PermissionDenied

class UserQuerysetMixin:
    """
    Mixin to filter queryset by user. 
    Admins get all objects; regular users get only their own objects.
    """
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Only allow regular users to see their own variables
        if not self.request.user.is_staff:
            queryset = queryset.filter(created_by=self.request.user)
        return queryset
