from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from ..models import EnvironmentVariable, VariableVersion
from api_usage.models import UserBilling
from ..serializers import EnvironmentVariableSerializer, VariableVersionSerializer
from ..mixins import VarsQuerysetMixin
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

class EnvironmentVariableViewSet(VarsQuerysetMixin, viewsets.ModelViewSet):
    queryset = EnvironmentVariable.objects.all()
    serializer_class = EnvironmentVariableSerializer
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        billing = get_object_or_404(UserBilling, user=user)

        # Check secrets usage limit
        if billing.secrets_used >= billing.plan.secrets_limit:
            raise ValidationError({"error": "Secret storage limit exceeded. Upgrade your plan."})

        try:
            # Save the new environment variable
            serializer.save(created_by=user)

            # Increment secrets used
            billing.secrets_used += 1
            billing.save()
        except IntegrityError:
            raise ValidationError({"error": "A secret with the same name already exists."})

class VariableVersionViewSet(VarsQuerysetMixin, viewsets.ModelViewSet):
    queryset = VariableVersion.objects.all()
    serializer_class = VariableVersionSerializer
    authentication_classes = [SessionAuthentication, JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        billing = get_object_or_404(UserBilling, user=user)

        # Retrieve the related variable
        variable = get_object_or_404(EnvironmentVariable, id=self.request.data['variable_id'])

        # Check version history limit
        existing_versions = VariableVersion.objects.filter(variable=variable).count()
        if existing_versions >= billing.plan.version_history_limit:
            raise ValidationError({"error": "Version history limit exceeded. Upgrade your plan."})

        # Determine version number
        version = self.request.data.get('version') or (existing_versions + 1)

        try:
            serializer.save(variable=variable, version=version, created_by=user)
        except IntegrityError:
            raise ValidationError({"error": f"Version '{version}' already exists for this variable."})
class VariableVersionsListView(APIView):
    def get(self, request, variable_id):
        versions = VariableVersion.objects.filter(variable_id=variable_id).order_by('-created_at')
        serializer = VariableVersionSerializer(versions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)