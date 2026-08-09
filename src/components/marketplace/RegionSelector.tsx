'use client'

import type React from 'react'
import { useRegion } from '@/context/RegionContext'

interface RegionOption {
  code: string
  name: string
  currency: string
}

const REGIONS: RegionOption[] = [
  { code: 'GLOBAL', name: 'Global (Mundial)', currency: 'USD' },
  { code: 'US', name: 'Estados Unidos', currency: 'USD' },
  { code: 'EU', name: 'Europa', currency: 'EUR' },
  { code: 'LATAM', name: 'Latinoamérica', currency: 'USD' },
  { code: 'VEN', name: 'Venezuela', currency: 'USD' },
]

export const RegionSelector = () => {
  const { selectedRegion, setSelectedRegion, setCurrency } = useRegion()

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = REGIONS.find((r) => r.code === e.target.value)
    if (selected) {
      setSelectedRegion(selected.code)
      setCurrency(selected.currency)
    }
  }

  return (
    <div className="flex items-center gap-2 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm border border-gray-700">
      <span className="text-gray-400">Región:</span>
      <select
        value={selectedRegion || 'GLOBAL'}
        onChange={handleRegionChange}
        className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
        aria-label="Seleccionar región"
      >
        {REGIONS.map((reg) => (
          <option key={reg.code} value={reg.code} className="bg-gray-900 text-white">
            {reg.name} ({reg.currency})
          </option>
        ))}
      </select>
    </div>
  )
}

export default RegionSelector