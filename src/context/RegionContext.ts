'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface RegionContextType {
  selectedRegion: string
  setSelectedRegion: (region: string) => void
  currency: string
  setCurrency: (currency: string) => void
}

const RegionContext = createContext<RegionContextType>({
  selectedRegion: 'GLOBAL',
  setSelectedRegion: () => {},
  currency: 'USD',
  setCurrency: () => {},
})

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('GLOBAL')
  const [currency, setCurrency] = useState<string>('USD')

  useEffect(() => {
    const savedRegion = localStorage.getItem('app_region')
    const savedCurrency = localStorage.getItem('app_currency')
    if (savedRegion) setSelectedRegion(savedRegion)
    if (savedCurrency) setCurrency(savedCurrency)
  }, [])

  const handleSetRegion = (region: string) => {
    setSelectedRegion(region)
    localStorage.setItem('app_region', region)
  }

  const handleSetCurrency = (curr: string) => {
    setCurrency(curr)
    localStorage.setItem('app_currency', curr)
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