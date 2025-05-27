from django.db import connection
from .models import Tenant

def create_tenant_schema(schema_name):
    """
    Create a new schema for a tenant
    """
    with connection.cursor() as cursor:
        cursor.execute(f'CREATE SCHEMA IF NOT EXISTS {schema_name}')

def drop_tenant_schema(schema_name):
    """
    Drop a tenant's schema
    """
    with connection.cursor() as cursor:
        cursor.execute(f'DROP SCHEMA IF EXISTS {schema_name} CASCADE')

def get_tenant_from_request(request):
    """
    Get the current tenant from the request
    """
    return getattr(request, 'tenant', None)

def set_tenant_schema(schema_name):
    """
    Set the current schema for the connection
    """
    connection.set_schema(schema_name)

def reset_schema():
    """
    Reset the schema to public
    """
    connection.set_schema('public') 