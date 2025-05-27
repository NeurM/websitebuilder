from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Tenant
from .utils import create_tenant_schema, drop_tenant_schema

@receiver(post_save, sender=Tenant)
def create_tenant_schema_handler(sender, instance, created, **kwargs):
    """
    Create schema when a new tenant is created
    """
    if created:
        create_tenant_schema(instance.schema_name)

@receiver(post_delete, sender=Tenant)
def drop_tenant_schema_handler(sender, instance, **kwargs):
    """
    Drop schema when a tenant is deleted
    """
    drop_tenant_schema(instance.schema_name) 