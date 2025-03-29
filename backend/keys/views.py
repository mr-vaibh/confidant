import json
import base64
import os
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from .models import UserPublicKey
from vars.models import EnvironmentVariable

User = get_user_model()

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
            json.dumps(credentials, indent=4),  
            content_type="application/json"
        )
        response['Content-Disposition'] = f'attachment; filename="credentials-{user.username}.json"'

        return response

class EncryptEnvironmentVariablesView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Get username from request body
            username = request.data.get("username")
            if not username:
                return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.filter(username=username).first()
            if not user:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            # Retrieve the public key from UserPublicKey model
            user_key_entry = UserPublicKey.objects.filter(user=user).first()
            if not user_key_entry or not user_key_entry.public_key:
                return Response({"error": "Public key not found for user"}, status=status.HTTP_404_NOT_FOUND)

            # Load the public key
            public_key = serialization.load_pem_public_key(user_key_entry.public_key.encode("utf-8"))

            # Fetch environment variables created by the user
            env_vars = EnvironmentVariable.objects.filter(created_by=user).prefetch_related("versions")

            if not env_vars:
                return Response({"error": "No environment variables found for user"}, status=status.HTTP_404_NOT_FOUND)

            # Convert environment variables and their versions into JSON format
            env_vars_list = []
            for env_var in env_vars:
                env_vars_list.append({
                    "name": env_var.name,
                    "description": env_var.description,
                    "created_at": env_var.created_at.isoformat() if env_var.created_at else None,
                    "updated_at": env_var.updated_at.isoformat() if env_var.updated_at else None,
                    "latest_version": env_var.latest_version.version if env_var.latest_version else None,
                    "versions": [
                        {
                            "version": version.version,
                            "value": version.value,
                            "created_at": version.created_at.isoformat() if version.created_at else None
                        }
                        for version in env_var.versions.all()
                    ]
                })

            # Convert to JSON
            env_vars_json = json.dumps(env_vars_list, indent=4).encode()

            # **AES Encryption**
            aes_key = os.urandom(32)  # Generate a 256-bit AES key
            iv = os.urandom(16)  # Generate a random IV

            cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv), backend=default_backend())
            encryptor = cipher.encryptor()

            # Pad the data to be multiple of 16 bytes
            padding_length = 16 - (len(env_vars_json) % 16)
            env_vars_json += bytes([padding_length]) * padding_length  # PKCS7 Padding

            encrypted_data = encryptor.update(env_vars_json) + encryptor.finalize()

            # **RSA Encryption of AES Key**
            encrypted_aes_key = public_key.encrypt(
                aes_key,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            )

            # Encode in base64 for safe transmission
            return JsonResponse({
                "encrypted_data": base64.b64encode(encrypted_data).decode("utf-8"),
                "encrypted_aes_key": base64.b64encode(encrypted_aes_key).decode("utf-8"),
                "iv": base64.b64encode(iv).decode("utf-8")
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
