# vars/mixins.py

from confidant.mixins import BaseUserFilterMixin

class VarsQuerysetMixin(BaseUserFilterMixin):
    user_field_name = 'created_by'