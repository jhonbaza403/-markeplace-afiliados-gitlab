'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface RegionContextType {
  region: string
  setRegion: (region: string) => void
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

// 1. Exportación de RegionProvider (necesario para layout.tsx)
export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<string>('default')

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  )
}

// 2. Exportación de useRegion (necesario para RegionSelector.tsx)
export const useRegion = (): RegionContextType => {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useRegion debe ser utilizado dentro de un RegionProvider')
  }
  return context
}

export default RegionContext