"""
WebSocket routing configuration for the website_builder project.
"""

from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from .consumers import WebsiteConsumer

# Import your WebSocket consumers here
# from your_app.consumers import YourConsumer

# Define WebSocket URL patterns
websocket_urlpatterns = [
    re_path(r'ws/website/(?P<website_id>\w+)/$', WebsiteConsumer.as_asgi()),
    # Add your WebSocket URL patterns here
    # Example:
    # re_path(r'ws/some_path/$', YourConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
}) 