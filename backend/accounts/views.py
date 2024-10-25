from rest_framework import viewsets
from .models import User, Profile
from .serializers import UserSerializer, ProfileSerializer
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Profile.objects.all()
        return Profile.objects.filter(user_obj=self.request.user)


# For /api/ list of URLS
from django.http import JsonResponse
from django.urls import reverse

def api_root(request):
    return JsonResponse({
        'users': reverse('user-list'),  # Replace 'user-list' with your UserViewSet's list name
        'profiles': reverse('profile-list'),  # Replace 'profile-list' with your ProfileViewSet's list name
        'token_obtain': reverse('token_obtain_pair'),
        'token_refresh': reverse('token_refresh'),
        'token_verify': reverse('token_verify'),
    })
