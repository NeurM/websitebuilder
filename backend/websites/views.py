from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Website, WebsiteConfig, Template
from .serializers import WebsiteSerializer, WebsiteConfigSerializer, TemplateSerializer
from django.views.generic import View
from django.http import FileResponse, HttpResponse
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class WebsiteViewSet(viewsets.ModelViewSet):
    serializer_class = WebsiteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filter websites based on tenant
        return Website.objects.filter(tenant__schema_name=self.request.tenant.schema_name)
    
    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

class FrontendAppView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Get the absolute path to index.html
            index_file = settings.FRONTEND_INDEX
            logger.info(f"Attempting to serve frontend from: {index_file}")
            
            # Check if file exists
            if not os.path.exists(index_file):
                logger.error(f"Frontend file not found at: {index_file}")
                return HttpResponse(f"Frontend files not found at {index_file}", status=404)
            
            # Read and return the file
            with open(index_file, 'rb') as f:
                content = f.read()
                logger.info(f"Successfully read {len(content)} bytes from index.html")
                response = HttpResponse(content, content_type='text/html')
                
                # Add CORS headers
                response["Access-Control-Allow-Origin"] = "*"
                response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
                response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
                response["Access-Control-Allow-Credentials"] = "true"
                
                # Add cache control headers
                response["Cache-Control"] = "no-cache, no-store, must-revalidate"
                response["Pragma"] = "no-cache"
                response["Expires"] = "0"
                
                return response
                
        except Exception as e:
            logger.error(f"Error serving frontend: {str(e)}", exc_info=True)
            return HttpResponse(f"Error serving frontend: {str(e)}", status=500)
            
    def options(self, request, *args, **kwargs):
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return response
