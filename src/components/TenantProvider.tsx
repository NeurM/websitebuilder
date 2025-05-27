import React, { createContext, useContext, useEffect, useState } from 'react'
import { Tenant, getCurrentTenant } from '../lib/tenant'

interface TenantContextType {
  tenant: Tenant | null
  loading: boolean
  error: Error | null
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  error: null
})

export function useTenant() {
  return useContext(TenantContext)
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTenant() {
      try {
        const currentTenant = await getCurrentTenant()
        setTenant(currentTenant)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load tenant'))
      } finally {
        setLoading(false)
      }
    }

    loadTenant()
  }, [])

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  )
} 