-- Create a function to create tenant-specific storage bucket
CREATE OR REPLACE FUNCTION create_tenant_storage_bucket(tenant_id UUID)
RETURNS void AS $$
BEGIN
    -- Create a storage bucket for the tenant
    INSERT INTO storage.buckets (id, name, public)
    VALUES (
        'tenant_' || tenant_id,
        'Tenant ' || tenant_id || ' Storage',
        false
    );

    -- Create RLS policies for the bucket
    CREATE POLICY "Tenant users can upload files"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
            bucket_id = 'tenant_' || get_current_tenant()::text
        );

    CREATE POLICY "Tenant users can view files"
        ON storage.objects FOR SELECT
        TO authenticated
        USING (
            bucket_id = 'tenant_' || get_current_tenant()::text
        );

    CREATE POLICY "Tenant users can update files"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (
            bucket_id = 'tenant_' || get_current_tenant()::text
        );

    CREATE POLICY "Tenant users can delete files"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (
            bucket_id = 'tenant_' || get_current_tenant()::text
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create storage bucket for new tenants
CREATE OR REPLACE FUNCTION create_tenant_storage_trigger()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_tenant_storage_bucket(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_tenant_storage_trigger
    AFTER INSERT ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION create_tenant_storage_trigger(); 