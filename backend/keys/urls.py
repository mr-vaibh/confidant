from django.urls import path
from .views import GenerateKeyView, EncryptEnvironmentVariablesView

urlpatterns = [
    path('generate-key/', GenerateKeyView.as_view(), name='generate-key'),
    path('get-sdk-keys/', EncryptEnvironmentVariablesView.as_view(), name='keys')
]
