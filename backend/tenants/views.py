from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Tenant
from .serializers import TenantSerializer

# Create your views here.

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filter tenants based on user permissions
        return Tenant.objects.filter(is_active=True)
