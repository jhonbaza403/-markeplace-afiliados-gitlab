'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface RegionContextType {
  selectedRegion: string
  setSelectedRegion: (region: string) => void
  currency: string
  setCurrency: (currency: string) => void
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

// Helper para actualizar cookies compatibles con Next.js / Server Actions
const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export const RegionProvider = ({
  children,
  initialRegion = 'GLOBAL',
  initialCurrency = 'USD',
}: {
  children: ReactNode
  initialRegion?: string
  initialCurrency?: string
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion)
  const [currency, setCurrency] = useState<string>(initialCurrency)

  const handleSetRegion = (region: string) => {
    setSelectedRegion(region)
    setCookie('app_region', region)
  }

  const handleSetCurrency = (curr: string) => {
    setCurrency(curr)
    setCookie('app_currency', curr)
  }

  return (
    <RegionContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion: handleSetRegion,
        currency,
        setCurrency: handleSetCurrency,
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useRegion debe ser usado dentro de un RegionProvider')
  }
  return context
}