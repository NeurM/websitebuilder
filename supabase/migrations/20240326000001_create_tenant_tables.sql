-- Create a function to create tenant-specific tables
CREATE OR REPLACE FUNCTION create_tenant_tables(tenant_id UUID)
RETURNS void AS $$
BEGIN
    EXECUTE '
        CREATE TABLE IF NOT EXISTS tenant_' || tenant_id || '.websites (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            domain TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS tenant_' || tenant_id || '.pages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            website_id UUID REFERENCES tenant_' || tenant_id || '.websites(id),
            title TEXT NOT NULL,
            content JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Enable RLS on tenant tables
        ALTER TABLE tenant_' || tenant_id || '.websites ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tenant_' || tenant_id || '.pages ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies for tenant tables
        CREATE POLICY "Tenant data is only accessible by tenant users"
            ON tenant_' || tenant_id || '.websites
            FOR ALL
            TO authenticated
            USING (get_current_tenant() = ''' || tenant_id || ''');

        CREATE POLICY "Tenant data is only accessible by tenant users"
            ON tenant_' || tenant_id || '.pages
            FOR ALL
            TO authenticated
            USING (get_current_tenant() = ''' || tenant_id || ''');
    ';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create tenant tables
CREATE OR REPLACE FUNCTION create_tenant_tables_trigger()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_tenant_tables(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_tenant_tables_trigger
    AFTER INSERT ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION create_tenant_tables_trigger(); 