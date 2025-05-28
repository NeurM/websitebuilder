from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from websites.views import FrontendAppView
from rest_framework.routers import DefaultRouter
from websites.views_public import (
    WebsiteViewSet,
    WebsiteConfigViewSet,
    TemplateViewSet,
    PreviewEmailViewSet,
    PreviewEmailTrackerViewSet,
    BulkWebsiteCreatorViewSet
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.static import serve
from django.views.generic import TemplateView
import os
import logging

logger = logging.getLogger(__name__)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'websites', WebsiteViewSet, basename='public-website')
router.register(r'website-configs', WebsiteConfigViewSet, basename='public-website-config')
router.register(r'templates', TemplateViewSet, basename='public-template')
router.register(r'preview-emails', PreviewEmailViewSet, basename='public-preview-email')
router.register(r'preview-email-trackers', PreviewEmailTrackerViewSet, basename='public-preview-email-tracker')
router.register(r'bulk-website-creators', BulkWebsiteCreatorViewSet, basename='public-bulk-website-creator')

# Public API URL patterns
urlpatterns = [
    # Admin URLs
    path('admin/', admin.site.urls),
    
    # Public API URLs - these must come before the frontend catch-all
    path('public/api/', include(router.urls)),
    path('public/api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('public/api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Static files
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    re_path(r'^frontend_static/(?P<path>.*)$', serve, {'document_root': settings.FRONTEND_DIR}),
    
    # Frontend catch-all - this must be last and should not match API routes
    re_path(r'^(?!public/api/)(?!admin/)(?!static/)(?!frontend_static/).*$', FrontendAppView.as_view(), name='frontend'),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

logger.info("URL patterns configured:")
for pattern in urlpatterns:
    logger.info(f"Pattern: {pattern}") 