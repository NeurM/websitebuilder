-- Create a table for tenant backups
CREATE TABLE IF NOT EXISTS tenant_backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'incremental')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    backup_path TEXT,
    size_bytes BIGINT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tenant_backups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Tenant users can view their backups"
    ON tenant_backups FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant());

-- Create a function to initiate a backup
CREATE OR REPLACE FUNCTION initiate_tenant_backup(
    p_tenant_id UUID,
    p_backup_type TEXT DEFAULT 'full'
)
RETURNS UUID AS $$
DECLARE
    v_backup_id UUID;
BEGIN
    INSERT INTO tenant_backups (
        tenant_id,
        backup_type,
        status
    )
    VALUES (
        p_tenant_id,
        p_backup_type,
        'pending'
    )
    RETURNING id INTO v_backup_id;

    -- Trigger backup process (this would be handled by a separate process)
    PERFORM pg_notify(
        'tenant_backup_requested',
        json_build_object(
            'backup_id', v_backup_id,
            'tenant_id', p_tenant_id,
            'backup_type', p_backup_type
        )::text
    );

    RETURN v_backup_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to restore from backup
CREATE OR REPLACE FUNCTION restore_tenant_from_backup(
    p_tenant_id UUID,
    p_backup_id UUID
)
RETURNS void AS $$
DECLARE
    v_backup tenant_backups;
BEGIN
    -- Get backup details
    SELECT * INTO v_backup
    FROM tenant_backups
    WHERE id = p_backup_id
    AND tenant_id = p_tenant_id
    AND status = 'completed';

    IF v_backup IS NULL THEN
        RAISE EXCEPTION 'Backup not found or not completed';
    END IF;

    -- Trigger restore process (this would be handled by a separate process)
    PERFORM pg_notify(
        'tenant_restore_requested',
        json_build_object(
            'backup_id', p_backup_id,
            'tenant_id', p_tenant_id,
            'backup_path', v_backup.backup_path
        )::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get backup history
CREATE OR REPLACE FUNCTION get_tenant_backup_history(
    p_tenant_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    backup_id UUID,
    backup_type TEXT,
    status TEXT,
    size_bytes BIGINT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        tb.id,
        tb.backup_type,
        tb.status,
        tb.size_bytes,
        tb.started_at,
        tb.completed_at
    FROM tenant_backups tb
    WHERE tb.tenant_id = p_tenant_id
    ORDER BY tb.started_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to clean up old backups
CREATE OR REPLACE FUNCTION cleanup_old_backups(
    p_retention_days INTEGER DEFAULT 30
)
RETURNS void AS $$
BEGIN
    -- Delete old completed backups
    DELETE FROM tenant_backups
    WHERE status = 'completed'
    AND completed_at < NOW() - (p_retention_days || ' days')::INTERVAL;

    -- Delete failed backups older than 7 days
    DELETE FROM tenant_backups
    WHERE status = 'failed'
    AND started_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 