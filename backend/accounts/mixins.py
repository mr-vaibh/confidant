# accounts/mixins.py

from confidant.mixins import BaseUserFilterMixin

class UserQuerysetMixin(BaseUserFilterMixin):
    user_field_name = 'id'
class ProfileQuerysetMixin(BaseUserFilterMixin):
    user_field_name = 'user_obj'