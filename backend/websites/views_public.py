from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Website, WebsiteConfig, Template, PreviewEmail, PreviewEmailTracker, BulkWebsiteCreator
from .serializers import (
    WebsiteSerializer,
    WebsiteConfigSerializer,
    TemplateSerializer,
    PreviewEmailSerializer,
    PreviewEmailTrackerSerializer,
    BulkWebsiteCreatorSerializer
)
import logging

logger = logging.getLogger(__name__)

class WebsiteViewSet(viewsets.ModelViewSet):
    queryset = Website.objects.all()
    serializer_class = WebsiteSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        logger.info("🔵 Fetching all websites")
        try:
            response = super().list(request, *args, **kwargs)
            logger.info(f"✅ Successfully fetched {len(response.data)} websites")
            return response
        except Exception as e:
            logger.error("🔴 Error in WebsiteViewSet.list:")
            logger.error(f"• Error type: {type(e).__name__}")
            logger.error(f"• Error message: {str(e)}")
            raise

    def retrieve(self, request, *args, **kwargs):
        logger.info(f"🔵 Fetching website with ID: {kwargs.get('pk')}")
        try:
            response = super().retrieve(request, *args, **kwargs)
            logger.info(f"✅ Successfully fetched website: {response.data.get('name', 'Unknown')}")
            return response
        except Exception as e:
            logger.error("🔴 Error in WebsiteViewSet.retrieve:")
            logger.error(f"• Error type: {type(e).__name__}")
            logger.error(f"• Error message: {str(e)}")
            raise

class WebsiteConfigViewSet(viewsets.ModelViewSet):
    queryset = WebsiteConfig.objects.all()
    serializer_class = WebsiteConfigSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        logger.info("🔵 Fetching all website configs")
        try:
            response = super().list(request, *args, **kwargs)
            logger.info(f"✅ Successfully fetched {len(response.data)} website configs")
            return response
        except Exception as e:
            logger.error("🔴 Error in WebsiteConfigViewSet.list:")
            logger.error(f"• Error type: {type(e).__name__}")
            logger.error(f"• Error message: {str(e)}")
            raise

    def retrieve(self, request, *args, **kwargs):
        logger.info(f"🔵 Fetching website config with ID: {kwargs.get('pk')}")
        try:
            response = super().retrieve(request, *args, **kwargs)
            logger.info(f"✅ Successfully fetched website config: {response.data.get('company_name', 'Unknown')}")
            return response
        except Exception as e:
            logger.error("🔴 Error in WebsiteConfigViewSet.retrieve:")
            logger.error(f"• Error type: {type(e).__name__}")
            logger.error(f"• Error message: {str(e)}")
            raise

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        logger.info("🔵 Fetching all templates")
        try:
            response = super().list(request, *args, **kwargs)
            logger.info(f"✅ Successfully fetched {len(response.data)} templates")
            return response
        except Exception as e:
            logger.error("🔴 Error in TemplateViewSet.list:")
            logger.error(f"• Error type: {type(e).__name__}")
            logger.error(f"• Error message: {str(e)}")
            raise

    def retrieve(self, request, *args, **kwargs):
        logger.info(f"🔵 Fetching template with ID: {kwargs.get('pk')}")
        try:
            response = super().retrieve(request, *args, **kwargs)
            logger.info(f"✅ Successfully fetched template: {response.data.get('name', 'Unknown')}")
            return response
        except Exception as e:
            logger.error("🔴 Error in TemplateViewSet.retrieve:")
            logger.error(f"• Error type: {type(e).__name__}")
            logger.error(f"• Error message: {str(e)}")
            raise

class PreviewEmailViewSet(viewsets.ModelViewSet):
    queryset = PreviewEmail.objects.all()
    serializer_class = PreviewEmailSerializer
    permission_classes = [AllowAny]

class PreviewEmailTrackerViewSet(viewsets.ModelViewSet):
    queryset = PreviewEmailTracker.objects.all()
    serializer_class = PreviewEmailTrackerSerializer
    permission_classes = [AllowAny]

class BulkWebsiteCreatorViewSet(viewsets.ModelViewSet):
    queryset = BulkWebsiteCreator.objects.all()
    serializer_class = BulkWebsiteCreatorSerializer
    permission_classes = [AllowAny] 