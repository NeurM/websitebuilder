from django.core.management.base import BaseCommand
from tenants.models import Domain, Tenant
from django_tenants.utils import schema_context

class Command(BaseCommand):
    help = 'Add localhost domain for public tenant'

    def handle(self, *args, **options):
        with schema_context('public'):
            # Get the public tenant
            public_tenant = Tenant.objects.get(schema_name='public')
            
            # Create domain for 127.0.0.1
            domain, created = Domain.objects.get_or_create(
                domain='127.0.0.1',
                tenant=public_tenant,
                defaults={'is_primary': True}
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS('Successfully created domain for 127.0.0.1'))
            else:
                self.stdout.write(self.style.SUCCESS('Domain for 127.0.0.1 already exists')) 