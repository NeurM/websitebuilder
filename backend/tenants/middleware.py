from django.db import connection
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from .models import Domain, Tenant

class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        hostname = request.get_host().split(':')[0]
        try:
            domain = Domain.objects.get(domain=hostname)
            connection.set_schema(domain.tenant.schema_name)
        except Domain.DoesNotExist:
            connection.set_schema('public')
        return None

    def process_response(self, request, response):
        connection.set_schema_to_public()
        return response 