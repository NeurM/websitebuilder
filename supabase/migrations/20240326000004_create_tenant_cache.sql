-- Create a table for tenant-specific cache
CREATE TABLE IF NOT EXISTS tenant_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    cache_key TEXT NOT NULL,
    cache_value JSONB,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, cache_key)
);

-- Enable RLS
ALTER TABLE tenant_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Tenant users can manage their cache"
    ON tenant_cache FOR ALL
    TO authenticated
    USING (tenant_id = get_current_tenant());

-- Create a function to get cached value
CREATE OR REPLACE FUNCTION get_cached_value(
    p_tenant_id UUID,
    p_cache_key TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_cache tenant_cache;
BEGIN
    SELECT * INTO v_cache
    FROM tenant_cache
    WHERE tenant_id = p_tenant_id
    AND cache_key = p_cache_key
    AND (expires_at IS NULL OR expires_at > NOW());

    IF v_cache IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN v_cache.cache_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to set cached value
CREATE OR REPLACE FUNCTION set_cached_value(
    p_tenant_id UUID,
    p_cache_key TEXT,
    p_cache_value JSONB,
    p_ttl_minutes INTEGER DEFAULT 60
)
RETURNS void AS $$
BEGIN
    INSERT INTO tenant_cache (
        tenant_id,
        cache_key,
        cache_value,
        expires_at
    )
    VALUES (
        p_tenant_id,
        p_cache_key,
        p_cache_value,
        CASE 
            WHEN p_ttl_minutes > 0 THEN NOW() + (p_ttl_minutes || ' minutes')::INTERVAL
            ELSE NULL
        END
    )
    ON CONFLICT (tenant_id, cache_key)
    DO UPDATE SET
        cache_value = EXCLUDED.cache_value,
        expires_at = EXCLUDED.expires_at,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 