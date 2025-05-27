from rest_framework import serializers
from .models import Tenant

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'schema_name', 'domain', 'settings', 'is_active', 'created_on']
        read_only_fields = ['schema_name', 'created_on'] 