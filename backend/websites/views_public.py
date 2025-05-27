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

class WebsiteViewSet(viewsets.ModelViewSet):
    queryset = Website.objects.all()
    serializer_class = WebsiteSerializer
    permission_classes = [AllowAny]

class WebsiteConfigViewSet(viewsets.ModelViewSet):
    queryset = WebsiteConfig.objects.all()
    serializer_class = WebsiteConfigSerializer
    permission_classes = [AllowAny]

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = [AllowAny]

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