from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.utils.html import format_html
from .models import WebsiteConfig, Template

class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_premium', 'created_at')
    list_filter = ('category', 'is_premium')
    search_fields = ('name', 'description')

class WebsiteConfigAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'domain_name', 'template', 'deployment_status', 'deployment_url_link', 'created_at')
    list_filter = ('deployment_status', 'template')
    search_fields = ('company_name', 'domain_name')
    readonly_fields = ('created_at', 'updated_at', 'last_deployed_at')
    actions = ['create_websites_from_list']

    def deployment_url_link(self, obj):
        if obj.deployment_url:
            return format_html('<a href="{}" target="_blank">{}</a>', obj.deployment_url, obj.deployment_url)
        return '-'
    deployment_url_link.short_description = 'Deployment URL'

    def create_websites_from_list(self, request, queryset):
        # This action will be triggered from the admin interface
        # The actual creation will be handled by the frontend
        self.message_user(request, "Please use the bulk creation form in the frontend interface.")
    create_websites_from_list.short_description = "Create websites from list"

admin.site.register(Template, TemplateAdmin)
admin.site.register(WebsiteConfig, WebsiteConfigAdmin)
