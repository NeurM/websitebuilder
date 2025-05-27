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
import os

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'websites', WebsiteViewSet, basename='public-website')
router.register(r'website-configs', WebsiteConfigViewSet, basename='public-website-config')
router.register(r'templates', TemplateViewSet, basename='public-template')
router.register(r'preview-emails', PreviewEmailViewSet, basename='public-preview-email')
router.register(r'preview-email-trackers', PreviewEmailTrackerViewSet, basename='public-preview-email-tracker')
router.register(r'bulk-website-creators', BulkWebsiteCreatorViewSet, basename='public-bulk-website-creator')

# Public schema URL patterns
urlpatterns = [
    # Admin URLs
    path('admin/', admin.site.urls),
    
    # API URLs
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve frontend static files
def serve_frontend_static(request, path):
    file_path = os.path.join(settings.FRONTEND_DIR, path)
    if os.path.exists(file_path):
        return serve(request, path, document_root=settings.FRONTEND_DIR)
    return FrontendAppView.as_view()(request)

# Add frontend routes
urlpatterns += [
    re_path(r'^static/(?P<path>.*)$', serve_frontend_static),
    re_path(r'^assets/(?P<path>.*)$', serve_frontend_static),
    re_path(r'^.*$', FrontendAppView.as_view(), name='frontend'),
] 