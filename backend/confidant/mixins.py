# mixins.py

class BaseUserFilterMixin:
    """
    Mixin to filter queryset by user. Admins get all objects; 
    regular users get only their own objects.
    This can be used by different types of models where a `user` field exists.
    """
    user_field_name = 'user'  # Default field name for the user-related filter

    def get_queryset(self):
        queryset = super().get_queryset()

        current_user = self.request.user.id if self.user_field_name == 'id' else self.request.user

        return queryset.filter(**{self.user_field_name: current_user})