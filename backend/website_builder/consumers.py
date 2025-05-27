"""
WebSocket consumers for handling real-time data from websites.
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django_tenants.utils import schema_context
from websites.models import Website

class WebsiteConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handle WebSocket connection."""
        self.website_id = self.scope['url_route']['kwargs']['website_id']
        self.room_group_name = f'website_{self.website_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Handle incoming WebSocket messages."""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'website_data':
                # Process website data
                await self.process_website_data(data)
            elif message_type == 'analytics':
                # Process analytics data
                await self.process_analytics_data(data)
            
            # Broadcast to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'broadcast_message',
                    'message': data
                }
            )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON format'
            }))

    async def broadcast_message(self, event):
        """Broadcast message to WebSocket."""
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def process_website_data(self, data):
        """Process website data in the correct tenant schema."""
        with schema_context(self.scope['tenant'].schema_name):
            website = Website.objects.get(id=self.website_id)
            # Process and store website data
            # Add your data processing logic here
            pass

    @database_sync_to_async
    def process_analytics_data(self, data):
        """Process analytics data in the correct tenant schema."""
        with schema_context(self.scope['tenant'].schema_name):
            # Process analytics data
            # Add your analytics processing logic here
            pass 