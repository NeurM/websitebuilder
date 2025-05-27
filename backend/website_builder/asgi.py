"""
ASGI config for website_builder project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django_tenants.utils import get_tenant_model, get_public_schema_name, schema_context

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website_builder.settings')

# Initialize Django ASGI application early to ensure the app is loaded properly
django.setup()

from .routing import websocket_urlpatterns

# Get the Django ASGI application
django_asgi_app = get_asgi_application()

# ASGI middleware to load the correct tenant based on subdomain/domain
class TenantASGIMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        host_header = dict(scope.get('headers', [])).get(b'host', b'').decode()
        host = host_header.split(':')[0]  # Remove port if present

        TenantModel = get_tenant_model()

        try:
            tenant = TenantModel.objects.get(domain_url=host)
        except TenantModel.DoesNotExist:
            # Use public schema as fallback
            schema = get_public_schema_name()
        else:
            schema = tenant.schema_name

        # Set the tenant schema in the current connection
        async with schema_context(schema):
            scope['tenant'] = schema
            await self.app(scope, receive, send)

# Wrap the ASGI application with the tenant middleware
application = ProtocolTypeRouter({
    "http": TenantASGIMiddleware(django_asgi_app),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            TenantASGIMiddleware(
                URLRouter(websocket_urlpatterns)
            )
        )
    ),
})
