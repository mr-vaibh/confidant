from ..serializers import UserSerializer, ProfileSerializer
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from ..mixins import UserQuerysetMixin, ProfileQuerysetMixin
from ..models import User, Profile

class UserViewSet(UserQuerysetMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

class ProfileViewSet(ProfileQuerysetMixin, viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]