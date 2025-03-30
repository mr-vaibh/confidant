from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.vars import EnvironmentVariableViewSet, VariableVersionViewSet, EncryptedVariablesView
from .views.vars import VariableVersionsListView
from .views.misc import manage_secrets

router = DefaultRouter()
router.register(r'variables', EnvironmentVariableViewSet)
router.register(r'versions', VariableVersionViewSet)

urlpatterns = [
    # Miscellaneous
    path('variables/manage-secrets/', manage_secrets, name='manage-secrets'),

    # Vars
    path("variables/<int:variable_id>/versions/", VariableVersionsListView.as_view(), name="variable-versions"),
    path('variables/encrypted/', EncryptedVariablesView.as_view(), name='encrypted_variables'),
    path('', include(router.urls)),
]
