from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnvironmentVariableViewSet, VariableVersionViewSet

router = DefaultRouter()
router.register(r'variables', EnvironmentVariableViewSet)
router.register(r'versions', VariableVersionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
