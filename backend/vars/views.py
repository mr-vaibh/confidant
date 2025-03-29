# views.py

from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import EnvironmentVariable, VariableVersion
from .serializers import EnvironmentVariableSerializer, VariableVersionSerializer
from .mixins import VarsQuerysetMixin

import json
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
from base64 import b64encode

class EnvironmentVariableViewSet(VarsQuerysetMixin, viewsets.ModelViewSet):
    queryset = EnvironmentVariable.objects.all()
    serializer_class = EnvironmentVariableSerializer
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class VariableVersionViewSet(VarsQuerysetMixin, viewsets.ModelViewSet):
    queryset = VariableVersion.objects.all()
    serializer_class = VariableVersionSerializer
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Retrieve the variable instance to associate with the new version
        variable = EnvironmentVariable.objects.get(id=self.request.data['variable_id'])
        # Use ternary operator to determine version
        version = self.request.data.get('version') or (VariableVersion.objects.filter(variable=variable).count() + 1)
        serializer.save(variable=variable, version=version, created_by=self.request.user)

class VariableVersionsListView(APIView):
    def get(self, request, variable_id):
        versions = VariableVersion.objects.filter(variable_id=variable_id).order_by('-created_at')
        serializer = VariableVersionSerializer(versions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Fetch sensitive data from the EnvironmentVariables model
def get_sensitive_data(username):
    """
    Fetch sensitive data from the EnvironmentVariable model for a specific user.

    Args:
        username (str): The username to filter variables by.

    Returns:
        dict: A dictionary with variable names as keys and their latest version's value as values.
    """
    sensitive_data = {}
    # Filter variables by the user associated with the provided username
    variables = EnvironmentVariable.objects.select_related('latest_version').filter(created_by__username=username)
    print(variables)
    for var in variables:
        sensitive_data[var.name] = var.latest_version.value if var.latest_version else None
    return sensitive_data

# API View to encrypt and send the variables data
class EncryptedVariablesView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        # Parse the SDK's public key and username from the request
        try:
            data = json.loads(request.body)
            client_public_key_str = data.get("public_key")
            username = data.get("username")  # Get the username from the request

            if not client_public_key_str:
                return JsonResponse({"error": "Public key is required."}, status=400)

            if not username:
                return JsonResponse({"error": "Username is required."}, status=400)

            client_public_key = RSA.import_key(client_public_key_str)
        except (ValueError, TypeError, KeyError) as e:
            return JsonResponse({"error": "Invalid input provided"}, status=400)

        # Fetch sensitive data for the specific user
        try:
            sensitive_data = get_sensitive_data(username)
            if not sensitive_data:
                return JsonResponse({"error": f"No data found for username: {username}"}, status=404)
        except Exception as e:
            return JsonResponse({"error": "Failed to fetch data", "details": str(e)}, status=500)

        sensitive_data_json = json.dumps(sensitive_data).encode("utf-8")

        # Encrypt the data using the SDK's public key
        try:
            cipher = PKCS1_OAEP.new(client_public_key)
            encrypted_data = cipher.encrypt(sensitive_data_json)
            encrypted_data_b64 = b64encode(encrypted_data).decode("utf-8")
        except Exception as e:
            return JsonResponse({"error": "Encryption failed", "details": str(e)}, status=500)

        # Send the encrypted data back to the SDK
        return JsonResponse({"encrypted_data": encrypted_data_b64}, status=200)
