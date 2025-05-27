-- Create a table for tenant analytics
CREATE TABLE IF NOT EXISTS tenant_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    metric_name TEXT NOT NULL,
    metric_value JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tenant_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Tenant users can view their analytics"
    ON tenant_analytics FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant());

CREATE POLICY "Tenant users can insert their analytics"
    ON tenant_analytics FOR INSERT
    TO authenticated
    WITH CHECK (tenant_id = get_current_tenant());

-- Create a function to track API usage
CREATE OR REPLACE FUNCTION track_api_usage(
    p_tenant_id UUID,
    p_endpoint TEXT,
    p_response_time INTEGER,
    p_status_code INTEGER
)
RETURNS void AS $$
BEGIN
    INSERT INTO tenant_analytics (
        tenant_id,
        metric_name,
        metric_value
    )
    VALUES (
        p_tenant_id,
        'api_usage',
        jsonb_build_object(
            'endpoint', p_endpoint,
            'response_time', p_response_time,
            'status_code', p_status_code
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to track storage usage
CREATE OR REPLACE FUNCTION track_storage_usage(
    p_tenant_id UUID,
    p_bucket_id TEXT,
    p_file_size BIGINT
)
RETURNS void AS $$
BEGIN
    INSERT INTO tenant_analytics (
        tenant_id,
        metric_name,
        metric_value
    )
    VALUES (
        p_tenant_id,
        'storage_usage',
        jsonb_build_object(
            'bucket_id', p_bucket_id,
            'file_size', p_file_size
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get tenant analytics
CREATE OR REPLACE FUNCTION get_tenant_analytics(
    p_tenant_id UUID,
    p_metric_name TEXT,
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    metric_name TEXT,
    metric_value JSONB,
    timestamp TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ta.metric_name,
        ta.metric_value,
        ta.timestamp
    FROM tenant_analytics ta
    WHERE ta.tenant_id = p_tenant_id
    AND ta.metric_name = p_metric_name
    AND ta.timestamp BETWEEN p_start_date AND p_end_date
    ORDER BY ta.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 