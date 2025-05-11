from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.rest import UserViewSet, ProfileViewSet
from .views.accounts import ActivationView, LogoutView, notifications, mark_as_read

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)

urlpatterns = [
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    path('account/activate/<uidb64>/<token>/', ActivationView.as_view(), name='account-activate'),
    path('account/notifications/<str:username>/', notifications, name='notifications'),
    path('account/notifications/mark-as-read/', mark_as_read, name='mark-as-done'),  # New URL

    path('account/', include(router.urls)),
]
