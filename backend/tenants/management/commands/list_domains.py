from django.core.management.base import BaseCommand
from tenants.models import Domain, Tenant
from django_tenants.utils import schema_context

class Command(BaseCommand):
    help = 'List all domains in the database'

    def handle(self, *args, **options):
        with schema_context('public'):
            domains = Domain.objects.all()
            self.stdout.write('Domains in database:')
            for domain in domains:
                self.stdout.write(f'- {domain.domain} (primary: {domain.is_primary})')
            
            tenants = Tenant.objects.all()
            self.stdout.write('\nTenants in database:')
            for tenant in tenants:
                self.stdout.write(f'- {tenant.name} (schema: {tenant.schema_name})') 