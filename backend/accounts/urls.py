from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ProfileViewSet, ActivationView, LogoutView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path('account/', include(router.urls)),
    path('account/activate/<uidb64>/<token>/', ActivationView.as_view(), name='account-activate'),
]
