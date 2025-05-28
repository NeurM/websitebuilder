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
            logger.info("=" * 50)
            logger.info("FrontendAppView - GET request received")
            logger.info(f"Request path: {request.path}")
            logger.info(f"Request method: {request.method}")
            logger.info(f"Request headers: {dict(request.headers)}")
            logger.info(f"Request GET params: {request.GET}")
            logger.info(f"Request POST params: {request.POST}")
            logger.info(f"Request tenant: {getattr(request, 'tenant', None)}")
            logger.info(f"Request schema_name: {getattr(request, 'schema_name', None)}")
            logger.info(f"Attempting to serve frontend from: {index_file}")
            logger.info(f"File exists: {os.path.exists(index_file)}")
            logger.info(f"Current working directory: {os.getcwd()}")
            logger.info(f"BASE_DIR: {settings.BASE_DIR}")
            logger.info(f"FRONTEND_DIR: {settings.FRONTEND_DIR}")
            logger.info(f"FRONTEND_INDEX: {settings.FRONTEND_INDEX}")
            logger.info("=" * 50)
            
            # Check if file exists
            if not os.path.exists(index_file):
                logger.error(f"Frontend file not found at: {index_file}")
                return HttpResponse(f"Frontend files not found at {index_file}", status=404)
            
            # Read and return the file
            with open(index_file, 'rb') as f:
                content = f.read()
                logger.info(f"Successfully read {len(content)} bytes from index.html")
                
                try:
                    # Replace asset paths to include /frontend_static/assets/ prefix
                    content = content.decode('utf-8')
                    logger.info("Successfully decoded content")
                    
                    # Log the content before replacement
                    logger.info("Content before replacement:")
                    logger.info(content[:500])  # Log first 500 chars
                    
                    # Update asset paths
                    content = content.replace('src="./assets/', 'src="/frontend_static/assets/')
                    content = content.replace('href="./assets/', 'href="/frontend_static/assets/')
                    content = content.replace('href="/vite.svg"', 'href="/frontend_static/vite.svg"')
                    content = content.replace('content="/og-image.png"', 'content="/frontend_static/og-image.png"')
                    
                    # Add base tag for client-side routing
                    content = content.replace('<head>', '<head><base href="/">')
                    
                    # Log the content after replacement
                    logger.info("Content after replacement:")
                    logger.info(content[:500])  # Log first 500 chars
                    
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
                    
                    logger.info("Successfully created response with frontend content")
                    return response
                    
                except Exception as e:
                    logger.error("Error processing content:")
                    logger.error(f"Error type: {type(e)}")
                    logger.error(f"Error message: {str(e)}")
                    logger.error("Content that caused error:")
                    logger.error(content[:1000])  # Log first 1000 chars
                    raise
                
        except Exception as e:
            logger.error("=" * 50)
            logger.error("Error in FrontendAppView")
            logger.error(f"Error type: {type(e)}")
            logger.error(f"Error message: {str(e)}")
            logger.error(f"Error args: {e.args}")
            logger.error("Full traceback:", exc_info=True)
            logger.error("=" * 50)
            return HttpResponse(f"Error serving frontend: {str(e)}", status=500)
            
    def options(self, request, *args, **kwargs):
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return response
