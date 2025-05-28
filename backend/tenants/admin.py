from django.contrib import admin, messages
from django.core.management import call_command
from tenants.models import Tenant
from websites.models import Website
from django.db import connection
from django.utils.html import format_html

@admin.action(description="Automate migrations and create default website for selected tenants")
def automate_tenant_setup(modeladmin, request, queryset):
    # Run migrate_schemas (for all schemas)
    call_command('migrate_schemas', interactive=False)
    created_count = 0
    for tenant in queryset:
        # Switch to tenant schema
        connection.set_schema(tenant.schema_name)
        # Create a default website if none exists
        if not Website.objects.exists():
            Website.objects.create(
                tenant=tenant,
                name='Default Website',
                slug='default-website',
                template='default',
                content={},
                is_published=False,
                meta_title='Default Website',
                meta_description='A default website',
                meta_keywords='default,website',
                facebook_url='',
                twitter_url='',
                instagram_url='',
                linkedin_url='',
            )
            created_count += 1
    connection.set_schema_to_public()
    messages.success(request, f"Migrations complete. Created {created_count} default website(s) for selected tenants.")

class TenantAdmin(admin.ModelAdmin):
    list_display = ("name", "schema_name", "created_on", "is_active")
    actions = [automate_tenant_setup]

admin.site.register(Tenant, TenantAdmin)
