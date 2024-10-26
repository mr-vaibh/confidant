# account/serializers.py

from djoser.serializers import UserCreateSerializer
from .models import User, Profile

class UserSerializer(UserCreateSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_active', 'is_staff']

class ProfileSerializer(UserCreateSerializer):
    user_obj = UserSerializer()

    class Meta:
        model = Profile
        fields = ['id', 'user_obj', 'organization_name']
