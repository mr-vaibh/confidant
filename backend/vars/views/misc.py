from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone
from ..models import EnvironmentVariable

User = get_user_model()

def manage_secrets(request, username=None):
    if not username:
        return JsonResponse({"error": "Username parameter is required"}, status=400)
    
    user = get_object_or_404(User, username=username)
    variables = EnvironmentVariable.objects.filter(created_by=user)
    count = variables.count()
    
    last_generated_days = (timezone.now() - variables.order_by('-created_at').first().created_at).days if count else None
    print(variables.order_by('-created_at').first().created_at)
    
    return JsonResponse({"total_variables_count": count, "last_generated_days": last_generated_days})
