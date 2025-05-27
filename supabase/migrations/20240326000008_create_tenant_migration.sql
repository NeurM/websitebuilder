-- Create a table for tenant migrations
CREATE TABLE IF NOT EXISTS tenant_migrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    source_schema TEXT NOT NULL,
    target_schema TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tenant_migrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Tenant users can view their migrations"
    ON tenant_migrations FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant());

-- Create a function to initiate tenant migration
CREATE OR REPLACE FUNCTION initiate_tenant_migration(
    p_tenant_id UUID,
    p_target_schema TEXT
)
RETURNS UUID AS $$
DECLARE
    v_migration_id UUID;
    v_source_schema TEXT;
BEGIN
    -- Get current schema
    SELECT schema_name INTO v_source_schema
    FROM tenants
    WHERE id = p_tenant_id;

    IF v_source_schema IS NULL THEN
        RAISE EXCEPTION 'Tenant not found';
    END IF;

    -- Create migration record
    INSERT INTO tenant_migrations (
        tenant_id,
        source_schema,
        target_schema,
        status
    )
    VALUES (
        p_tenant_id,
        v_source_schema,
        p_target_schema,
        'pending'
    )
    RETURNING id INTO v_migration_id;

    -- Trigger migration process (this would be handled by a separate process)
    PERFORM pg_notify(
        'tenant_migration_requested',
        json_build_object(
            'migration_id', v_migration_id,
            'tenant_id', p_tenant_id,
            'source_schema', v_source_schema,
            'target_schema', p_target_schema
        )::text
    );

    RETURN v_migration_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get migration status
CREATE OR REPLACE FUNCTION get_migration_status(
    p_migration_id UUID
)
RETURNS TABLE (
    status TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        tm.status,
        tm.started_at,
        tm.completed_at,
        tm.error_message
    FROM tenant_migrations tm
    WHERE tm.id = p_migration_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to rollback migration
CREATE OR REPLACE FUNCTION rollback_tenant_migration(
    p_migration_id UUID
)
RETURNS void AS $$
DECLARE
    v_migration tenant_migrations;
BEGIN
    -- Get migration details
    SELECT * INTO v_migration
    FROM tenant_migrations
    WHERE id = p_migration_id
    AND status = 'completed';

    IF v_migration IS NULL THEN
        RAISE EXCEPTION 'Migration not found or not completed';
    END IF;

    -- Trigger rollback process (this would be handled by a separate process)
    PERFORM pg_notify(
        'tenant_migration_rollback_requested',
        json_build_object(
            'migration_id', p_migration_id,
            'tenant_id', v_migration.tenant_id,
            'source_schema', v_migration.source_schema,
            'target_schema', v_migration.target_schema
        )::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get migration history
CREATE OR REPLACE FUNCTION get_tenant_migration_history(
    p_tenant_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    migration_id UUID,
    source_schema TEXT,
    target_schema TEXT,
    status TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        tm.id,
        tm.source_schema,
        tm.target_schema,
        tm.status,
        tm.started_at,
        tm.completed_at
    FROM tenant_migrations tm
    WHERE tm.tenant_id = p_tenant_id
    ORDER BY tm.started_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 