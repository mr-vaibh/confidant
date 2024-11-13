# views.py

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import EnvironmentVariable, VariableVersion
from .serializers import EnvironmentVariableSerializer, VariableVersionSerializer
from .mixins import VarsQuerysetMixin

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
        # Auto-increment version number based on existing versions
        latest_version = VariableVersion.objects.filter(variable=variable).count() + 1
        serializer.save(variable=variable, version=latest_version, created_by=self.request.user)

class VariableVersionsListView(APIView):
    def get(self, request, variable_id):
        versions = VariableVersion.objects.filter(variable_id=variable_id).order_by('-created_at')
        serializer = VariableVersionSerializer(versions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)