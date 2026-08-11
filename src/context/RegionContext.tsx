'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// 1. Tipado de los datos del contexto
interface RegionContextType {
  region: string
  setRegion: (region: string) => void
}

// 2. Creación del contexto
const RegionContext = createContext<RegionContextType | undefined>(undefined)

// 3. Proveedor del Contexto (para layout.tsx)
export const RegionProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<string>('default')

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  )
}

// 4. Hook personalizado (para RegionSelector.tsx)
export const useRegion = (): RegionContextType => {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useRegion debe ser utilizado dentro de un RegionProvider')
  }
  return context
}

export default RegionContext