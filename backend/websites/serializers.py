from rest_framework import serializers
from .models import (
    Website,
    WebsiteConfig,
    Template,
    PreviewEmail,
    PreviewEmailTracker,
    BulkWebsiteCreator
)

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'

class WebsiteConfigSerializer(serializers.ModelSerializer):
    template = TemplateSerializer(read_only=True)
    template_id = serializers.PrimaryKeyRelatedField(
        queryset=Template.objects.all(),
        source='template',
        write_only=True
    )

    class Meta:
        model = WebsiteConfig
        fields = [
            'id',
            'template',
            'template_id',
            'company_name',
            'domain_name',
            'logo',
            'color_scheme',
            'secondary_color_scheme',
            'deployment_status',
            'deployment_url',
            'last_deployed_at',
            'created_at',
            'updated_at',
            'user_id',
            # Analytics fields
            'google_analytics_id',
            'google_tag_manager_id',
            'facebook_pixel_id',
            'custom_analytics_script',
            # Cookie fields
            'cookie_enabled',
            'cookie_banner_text',
            'cookie_accept_button_text',
            'cookie_decline_button_text',
            'cookie_policy_url',
            'cookie_duration',
            'cookie_categories',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_deployed_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Convert cookie settings to the expected format
        data['analytics'] = {
            'google_analytics_id': instance.google_analytics_id,
            'google_tag_manager_id': instance.google_tag_manager_id,
            'facebook_pixel_id': instance.facebook_pixel_id,
            'custom_analytics_script': instance.custom_analytics_script,
        }
        data['cookies'] = {
            'enabled': instance.cookie_enabled,
            'banner_text': instance.cookie_banner_text,
            'accept_button_text': instance.cookie_accept_button_text,
            'decline_button_text': instance.cookie_decline_button_text,
            'cookie_policy_url': instance.cookie_policy_url,
            'cookie_duration': instance.cookie_duration,
            'cookie_categories': instance.cookie_categories,
        }
        return data

    def to_internal_value(self, data):
        # Handle nested analytics and cookies data
        if 'analytics' in data:
            analytics = data.pop('analytics')
            data.update({
                'google_analytics_id': analytics.get('google_analytics_id'),
                'google_tag_manager_id': analytics.get('google_tag_manager_id'),
                'facebook_pixel_id': analytics.get('facebook_pixel_id'),
                'custom_analytics_script': analytics.get('custom_analytics_script'),
            })

        if 'cookies' in data:
            cookies = data.pop('cookies')
            data.update({
                'cookie_enabled': cookies.get('enabled', True),
                'cookie_banner_text': cookies.get('banner_text', 'We use cookies to enhance your experience.'),
                'cookie_accept_button_text': cookies.get('accept_button_text', 'Accept All'),
                'cookie_decline_button_text': cookies.get('decline_button_text', 'Decline All'),
                'cookie_policy_url': cookies.get('cookie_policy_url'),
                'cookie_duration': cookies.get('cookie_duration', 365),
                'cookie_categories': cookies.get('cookie_categories', {
                    'necessary': True,
                    'analytics': True,
                    'marketing': True,
                    'preferences': True,
                }),
            })

        return super().to_internal_value(data)

class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = '__all__'

class PreviewEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviewEmail
        fields = '__all__'

class PreviewEmailTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviewEmailTracker
        fields = '__all__'

class BulkWebsiteCreatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulkWebsiteCreator
        fields = '__all__' 