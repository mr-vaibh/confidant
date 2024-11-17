import json
from django.http import JsonResponse, HttpResponse
import base64
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import UserPublicKey

class GenerateKeyView(APIView):
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Generate a new RSA key pair
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )

        # Serialize the private key to be returned to the user
        private_key_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )

        # Serialize the public key to store in the database
        public_key = private_key.public_key()
        public_key_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )

        # Save or update the public key in the database
        UserPublicKey.objects.update_or_create(
            user=user,
            defaults={'public_key': public_key_pem.decode('utf-8')}
        )

        # Encode the private key to base64 for easier handling
        private_key_b64 = base64.b64encode(private_key_pem).decode('utf-8')

        # Create the credentials JSON
        credentials = {
            "username": user.username,
            "public_key": public_key_pem.decode("utf-8"),
            "private_key": private_key_b64,
        }

        # Generate a downloadable JSON response
        response = HttpResponse(
            json.dumps(credentials, indent=4),  # Pretty-print for readability
            content_type="application/json"
        )
        response['Content-Disposition'] = f'attachment; filename="credentials-{user.username}.json"'

        return response
