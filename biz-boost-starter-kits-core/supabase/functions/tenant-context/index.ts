import { createClient } from '@supabase/supabase-js'
import type { Request, Response } from 'express'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export default async function handler(req: Request, res: Response) {
  if (req.method === 'OPTIONS') {
    return res.status(200).set(corsHeaders).send('ok')
  }

  try {
    const supabaseClient = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? ''
    )

    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    if (userError) throw userError
    if (!user) {
      throw new Error('User not found')
    }

    // Get tenant from user metadata
    const tenantId = user.user_metadata.tenant_id
    if (!tenantId) {
      throw new Error('No tenant associated with user')
    }

    // Check rate limit
    const { data: rateLimitAllowed, error: rateLimitError } = await supabaseClient.rpc(
      'check_rate_limit',
      {
        p_tenant_id: tenantId,
        p_endpoint: 'tenant-context',
        p_limit: 1000,
        p_window_minutes: 60
      }
    )

    if (rateLimitError) throw rateLimitError
    if (!rateLimitAllowed) {
      return res.status(429)
        .set(corsHeaders)
        .json({ error: 'Rate limit exceeded' })
    }

    // Try to get tenant from cache
    const { data: cachedTenant, error: cacheError } = await supabaseClient.rpc(
      'get_cached_value',
      {
        p_tenant_id: tenantId,
        p_cache_key: 'tenant_context'
      }
    )

    if (!cacheError && cachedTenant) {
      return res.status(200)
        .set(corsHeaders)
        .json({ success: true, tenant: cachedTenant })
    }

    // Set tenant context
    await supabaseClient.rpc('set_current_tenant', { tenant_id: tenantId })

    // Get tenant details
    const { data: tenant, error: tenantError } = await supabaseClient
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (tenantError) throw tenantError

    // Cache tenant details
    await supabaseClient.rpc('set_cached_value', {
      p_tenant_id: tenantId,
      p_cache_key: 'tenant_context',
      p_cache_value: tenant,
      p_ttl_minutes: 5
    })

    return res.status(200)
      .set(corsHeaders)
      .json({ success: true, tenant })
  } catch (error) {
    return res.status(400)
      .set(corsHeaders)
      .json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
} 