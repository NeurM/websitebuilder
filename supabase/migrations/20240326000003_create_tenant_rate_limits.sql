-- Create a table to track API usage per tenant
CREATE TABLE IF NOT EXISTS tenant_api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 0,
    last_reset TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tenant_api_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Tenant users can view their API usage"
    ON tenant_api_usage FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant());

-- Create a function to check and update rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_tenant_id UUID,
    p_endpoint TEXT,
    p_limit INTEGER DEFAULT 1000,
    p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
    v_usage tenant_api_usage;
BEGIN
    -- Get or create usage record
    SELECT * INTO v_usage
    FROM tenant_api_usage
    WHERE tenant_id = p_tenant_id
    AND endpoint = p_endpoint
    FOR UPDATE;

    IF v_usage IS NULL THEN
        INSERT INTO tenant_api_usage (tenant_id, endpoint)
        VALUES (p_tenant_id, p_endpoint)
        RETURNING * INTO v_usage;
    END IF;

    -- Check if we need to reset the counter
    IF v_usage.last_reset < NOW() - (p_window_minutes || ' minutes')::INTERVAL THEN
        UPDATE tenant_api_usage
        SET request_count = 1,
            last_reset = NOW()
        WHERE id = v_usage.id;
        RETURN TRUE;
    END IF;

    -- Check if we're under the limit
    IF v_usage.request_count < p_limit THEN
        UPDATE tenant_api_usage
        SET request_count = request_count + 1
        WHERE id = v_usage.id;
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 