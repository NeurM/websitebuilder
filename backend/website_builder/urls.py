"""
URL configuration for website_builder project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets
from rest_framework.response import Response
from websites.views import WebsiteViewSet, FrontendAppView
from websites.views_public import (
    WebsiteViewSet as PublicWebsiteViewSet,
    WebsiteConfigViewSet as PublicWebsiteConfigViewSet,
    TemplateViewSet as PublicTemplateViewSet,
    PreviewEmailViewSet as PublicPreviewEmailViewSet,
    PreviewEmailTrackerViewSet as PublicPreviewEmailTrackerViewSet,
    BulkWebsiteCreatorViewSet as PublicBulkWebsiteCreatorViewSet
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.static import serve
import os
import logging

logger = logging.getLogger(__name__)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'websites', WebsiteViewSet, basename='website')

# Dummy viewset for testing
class DummyViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({"hello": "world"})

# Public API router
print("✅ Registering public API routes")
public_router = DefaultRouter()
public_router.register(r'dummy', DummyViewSet, basename='dummy')
public_router.register(r'websites', PublicWebsiteViewSet, basename='public-website')
public_router.register(r'website-configs', PublicWebsiteConfigViewSet, basename='public-website-config')
public_router.register(r'templates', PublicTemplateViewSet, basename='public-template')
public_router.register(r'preview-emails', PublicPreviewEmailViewSet, basename='public-preview-email')
public_router.register(r'preview-email-trackers', PublicPreviewEmailTrackerViewSet, basename='public-preview-email-tracker')
public_router.register(r'bulk-website-creators', PublicBulkWebsiteCreatorViewSet, basename='public-bulk-website-creator')

# Main URL patterns
urlpatterns = [
    # Admin URLs
    path('admin/', admin.site.urls),
    
    # API URLs - these must come before the frontend catch-all
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Public API URLs
    path('public/api/', include(public_router.urls)),
    
    # Static files
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    
    # Frontend catch-all - this must be last and should not match API routes
    re_path(r'^(?!api/)(?!public/api/)(?!admin/)(?!static/)(?!media/).*$', FrontendAppView.as_view(), name='frontend'),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
