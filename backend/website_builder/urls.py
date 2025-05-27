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

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'websites', WebsiteViewSet, basename='website')

# Public API router
public_router = DefaultRouter()
public_router.register(r'websites', PublicWebsiteViewSet, basename='public-website')
public_router.register(r'website-configs', PublicWebsiteConfigViewSet, basename='public-website-config')
public_router.register(r'templates', PublicTemplateViewSet, basename='public-template')
public_router.register(r'preview-emails', PublicPreviewEmailViewSet, basename='public-preview-email')
public_router.register(r'preview-email-trackers', PublicPreviewEmailTrackerViewSet, basename='public-preview-email-tracker')
public_router.register(r'bulk-website-creators', PublicBulkWebsiteCreatorViewSet, basename='public-bulk-website-creator')

# API URL patterns
api_urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Public API URL patterns
public_api_urlpatterns = [
    path('', include(public_router.urls)),
]

# Main URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_urlpatterns)),
    path('public/api/', include(public_api_urlpatterns)),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve frontend static files
def serve_frontend_static(request, path):
    file_path = os.path.join(settings.STATICFILES_DIRS[0], path)
    if os.path.exists(file_path):
        return serve(request, path, document_root=settings.STATICFILES_DIRS[0])
    return FrontendAppView.as_view()(request)

# Add frontend routes
urlpatterns += [
    re_path(r'^static/(?P<path>.*)$', serve_frontend_static),
    re_path(r'^assets/(?P<path>.*)$', serve_frontend_static),
    re_path(r'^.*$', FrontendAppView.as_view(), name='frontend'),
]
