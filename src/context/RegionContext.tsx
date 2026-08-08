'use client'

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'

interface RegionContextType {
  selectedRegion: string
  setSelectedRegion: (region: string) => void
  currency: string
  setCurrency: (currency: string) => void
}

// 1. Mejor tipado: inicializar con undefined para garantizar que se detecte el uso fuera del Provider
const RegionContext = createContext<RegionContextType | undefined>(undefined)

export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('GLOBAL')
  const [currency, setCurrency] = useState<string>('USD')
  
  // 2. Estado para controlar la hidratación y evitar discrepancias entre Server y Client
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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

  // 3. useMemo: Evita re-renderizados innecesarios en los componentes consumidores
  const value = useMemo(
    () => ({
      selectedRegion,
      setSelectedRegion: handleSetRegion,
      currency,
      setCurrency: handleSetCurrency,
    }),
    [selectedRegion, currency] // Solo se recalcula si estas variables cambian
  )

  // 4. Prevenir parpadeos o errores de hidratación ocultando temporalmente (opcional pero recomendado)
  // Si necesitas que el HTML inicial se renderice por SEO, puedes omitir este if, pero
  // debes estar consciente de que los valores iniciales ('GLOBAL' / 'USD') parpadearán.
  if (!isMounted) {
    return null 
  }

  // 5. React 19 (Next.js 15): Puedes usar directamente `<RegionContext>` en lugar de `<RegionContext.Provider>`
  return <RegionContext value={value}>{children}</RegionContext>
}

export const useRegion = () => {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useRegion debe ser usado dentro de un RegionProvider')
  }
  return context
}