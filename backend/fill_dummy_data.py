import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website_builder.settings')
django.setup()

from tenants.models import Tenant, Domain
from django.contrib.auth import get_user_model
from websites.models import WebsiteConfig, Template

User = get_user_model()

# Create a tenant and domain
def create_tenant_and_domain(schema_name, name, domain_name):
    paid_until = datetime.now() + timedelta(days=30)
    tenant, _ = Tenant.objects.get_or_create(
        schema_name=schema_name,
        defaults={
            'name': name,
            'is_active': True,
            'paid_until': paid_until,
            'on_trial': True
        }
    )
    Domain.objects.get_or_create(
        domain=domain_name,
        tenant=tenant,
        is_primary=True
    )
    return tenant

# Create a user
def create_user(username, email, password):
    user, created = User.objects.get_or_create(username=username, defaults={'email': email})
    if created:
        user.set_password(password)
        user.save()
    return user

# Create a template
def create_template():
    template, _ = Template.objects.get_or_create(
        name='Basic Template',
        defaults={
            'description': 'A simple template',
            'thumbnail_url': 'http://example.com/thumb.png',
            'preview_url': 'http://example.com/preview',
            'category': 'Business',
            'features': ['feature1', 'feature2'],
            'is_premium': False
        }
    )
    return template

# Create a website config
def create_website_config(user, template, domain_name):
    WebsiteConfig.objects.get_or_create(
        company_name='Test Company',
        domain_name=domain_name,
        defaults={
            'template': template,
            'user': user,
            'logo': 'http://example.com/logo.png',
            'color_scheme': 'blue',
            'secondary_color_scheme': 'green',
            'deployment_status': 'pending',
            'cookie_enabled': True,
            'cookie_banner_text': 'We use cookies!',
            'cookie_accept_button_text': 'Accept',
            'cookie_decline_button_text': 'Decline',
            'cookie_policy_url': 'http://example.com/cookie-policy',
            'cookie_duration': 365,
            'cookie_categories': {'necessary': True, 'analytics': False},
        }
    )

if __name__ == '__main__':
    # Create tenant and domain
    tenant = create_tenant_and_domain('test1', 'Test Tenant 1', 'test1.localhost')
    # Create user
    user = create_user('dummyuser', 'dummy@example.com', 'password123')
    # Create template
    template = create_template()
    # Create website config
    create_website_config(user, template, 'test1.localhost')
    print('Dummy data created!') 