-- Create a schema for each tenant
CREATE OR REPLACE FUNCTION create_tenant_schema(tenant_id UUID)
RETURNS void AS $$
BEGIN
    EXECUTE 'CREATE SCHEMA IF NOT EXISTS tenant_' || tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    schema_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Tenants are viewable by authenticated users"
    ON tenants FOR SELECT
    TO authenticated
    USING (true);

-- Create a function to get current tenant
CREATE OR REPLACE FUNCTION get_current_tenant()
RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_tenant', true)::UUID;
END;
$$ LANGUAGE plpgsql;

-- Create a function to set current tenant
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_id UUID)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_tenant', tenant_id::text, false);
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically create schema for new tenants
CREATE OR REPLACE FUNCTION create_tenant_schema_trigger()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_tenant_schema(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_tenant_schema_trigger
    AFTER INSERT ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION create_tenant_schema_trigger(); 