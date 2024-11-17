from django.urls import path
from .views import GenerateKeyView

urlpatterns = [
    path('generate-key/', GenerateKeyView.as_view(), name='generate-key'),
]
