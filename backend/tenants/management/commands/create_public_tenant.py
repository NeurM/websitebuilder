from django.core.management.base import BaseCommand
from django_tenants.utils import schema_context
from tenants.models import Tenant, Domain

class Command(BaseCommand):
    help = 'Creates the public tenant if it does not exist'

    def handle(self, *args, **options):
        with schema_context('public'):
            # Create public tenant if it doesn't exist
            tenant, created = Tenant.objects.get_or_create(
                schema_name='public',
                defaults={
                    'name': 'Public Tenant',
                    'paid_until': None,
                    'on_trial': False,
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS('Created public tenant'))
            else:
                self.stdout.write(self.style.SUCCESS('Public tenant already exists'))
            
            # Create domain for public tenant if it doesn't exist
            domain, created = Domain.objects.get_or_create(
                domain='localhost',
                tenant=tenant,
                defaults={
                    'is_primary': True,
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS('Created public domain'))
            else:
                self.stdout.write(self.style.SUCCESS('Public domain already exists')) 