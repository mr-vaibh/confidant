from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from ..models import EnvironmentVariable

User = get_user_model()

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def manage_secrets(request):
    # Use the current logged-in user
    user = request.user

    # Get all environment variables created by this user
    variables = EnvironmentVariable.objects.filter(created_by=user)
    count = variables.count()
    
    # Calculate the days since the last variable was generated
    last_generated_days = (timezone.now() - variables.order_by('-created_at').first().created_at).days if count else None
    
    return JsonResponse({
        "total_variables_count": count, 
        "last_generated_days": last_generated_days
    })
