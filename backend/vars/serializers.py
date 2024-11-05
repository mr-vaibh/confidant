# serializers.py

from rest_framework import serializers
from .models import EnvironmentVariable, VariableVersion

class VariableVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariableVersion
        fields = ['id', 'value', 'version', 'created_at', 'created_by']

class EnvironmentVariableSerializer(serializers.ModelSerializer):
    versions = VariableVersionSerializer(many=True, read_only=True)

    class Meta:
        model = EnvironmentVariable
        fields = ['id', 'name', 'created_by', 'created_at', 'versions']
