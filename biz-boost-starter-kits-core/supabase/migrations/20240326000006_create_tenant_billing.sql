-- Create a table for tenant billing plans
CREATE TABLE IF NOT EXISTS billing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    features JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a table for tenant subscriptions
CREATE TABLE IF NOT EXISTS tenant_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    plan_id UUID REFERENCES billing_plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a table for tenant invoices
CREATE TABLE IF NOT EXISTS tenant_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id),
    subscription_id UUID REFERENCES tenant_subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
    due_date TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view billing plans"
    ON billing_plans FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Tenant users can view their subscriptions"
    ON tenant_subscriptions FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant());

CREATE POLICY "Tenant users can view their invoices"
    ON tenant_invoices FOR SELECT
    TO authenticated
    USING (tenant_id = get_current_tenant());

-- Create a function to create a subscription
CREATE OR REPLACE FUNCTION create_tenant_subscription(
    p_tenant_id UUID,
    p_plan_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_subscription_id UUID;
BEGIN
    INSERT INTO tenant_subscriptions (
        tenant_id,
        plan_id,
        status,
        current_period_start,
        current_period_end
    )
    VALUES (
        p_tenant_id,
        p_plan_id,
        'active',
        NOW(),
        NOW() + INTERVAL '1 month'
    )
    RETURNING id INTO v_subscription_id;

    -- Create initial invoice
    INSERT INTO tenant_invoices (
        tenant_id,
        subscription_id,
        amount,
        status,
        due_date
    )
    SELECT
        p_tenant_id,
        v_subscription_id,
        bp.price,
        'open',
        NOW() + INTERVAL '7 days'
    FROM billing_plans bp
    WHERE bp.id = p_plan_id;

    RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to generate monthly invoices
CREATE OR REPLACE FUNCTION generate_monthly_invoices()
RETURNS void AS $$
BEGIN
    INSERT INTO tenant_invoices (
        tenant_id,
        subscription_id,
        amount,
        status,
        due_date
    )
    SELECT
        ts.tenant_id,
        ts.id,
        bp.price,
        'open',
        NOW() + INTERVAL '7 days'
    FROM tenant_subscriptions ts
    JOIN billing_plans bp ON bp.id = ts.plan_id
    WHERE ts.status = 'active'
    AND ts.current_period_end <= NOW() + INTERVAL '7 days'
    AND NOT ts.cancel_at_period_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get tenant billing summary
CREATE OR REPLACE FUNCTION get_tenant_billing_summary(
    p_tenant_id UUID
)
RETURNS TABLE (
    subscription_status TEXT,
    current_plan TEXT,
    next_billing_date TIMESTAMPTZ,
    total_due DECIMAL(10,2),
    last_payment_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ts.status,
        bp.name,
        ts.current_period_end,
        COALESCE(SUM(ti.amount), 0),
        MAX(ti.paid_at)
    FROM tenant_subscriptions ts
    JOIN billing_plans bp ON bp.id = ts.plan_id
    LEFT JOIN tenant_invoices ti ON ti.subscription_id = ts.id
    WHERE ts.tenant_id = p_tenant_id
    GROUP BY ts.status, bp.name, ts.current_period_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 