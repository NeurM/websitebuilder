from django.conf import settings

class TenantRouter:
    """
    Router to handle tenant-specific models
    """
    def db_for_read(self, model, **hints):
        if hasattr(model, '_meta') and hasattr(model._meta, 'tenant_specific'):
            return 'default'
        return None

    def db_for_write(self, model, **hints):
        if hasattr(model, '_meta') and hasattr(model._meta, 'tenant_specific'):
            return 'default'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'tenants':
            return True
        return None 