from django.utils.encoding import force_str
from django.shortcuts import get_object_or_404
from django.utils.http import urlsafe_base64_decode
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.core.exceptions import PermissionDenied

from ..models import User, Notification

class ActivationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            # Decode the UID and get the user
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_object_or_404(User, pk=uid)

            # Check if the token is valid
            if user.is_active:
                return Response({'detail': 'Account already activated.'}, status=status.HTTP_400_BAD_REQUEST)

            # Activate the user (mark them as active)
            if user.check_activation_token(token):
                user.is_active = True
                user.save()
                return Response({'detail': 'Account activated successfully.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid activation token.'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except (ObjectDoesNotExist, TokenError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, JWTAuthentication])
@permission_classes([IsAuthenticated])
def notifications(request, username=None):
    if not username:
        return JsonResponse({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)
    user = get_object_or_404(User, username=username)
    notifications = Notification.objects.filter(profile__user_obj=user).order_by('-created_at').values()
    notifications_data = list(notifications.values())
    return JsonResponse({'notifications': notifications_data})

@api_view(['POST'])
@authentication_classes([SessionAuthentication, JWTAuthentication])
@permission_classes([IsAuthenticated])
def mark_as_read(request):
    # Get the notification ID from the request data
    notification_id = request.data.get("notification_id")

    if not notification_id:
        return JsonResponse({"error": "Notification ID is required"}, status=400)

    # Get the notification object or return an error if not found
    notification = get_object_or_404(Notification, id=notification_id)

    # Check if the current user owns the notification (if applicable, e.g., related to the user)
    # Assuming a Notification is related to a user through the profile
    if notification.profile.user_obj != request.user:
        raise PermissionDenied("You don't have permission to mark this notification as read.")

    # Mark the notification as read
    notification.mark_as_read()

    return JsonResponse({"message": "Notification marked as read"})