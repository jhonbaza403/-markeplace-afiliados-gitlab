'use client'

import React, { useState } from 'react'

const regions = [
  { code: 'ES', label: 'España (EUR €)', currency: 'EUR' },
  { code: 'US', label: 'Estados Unidos (USD $)', currency: 'USD' },
  { code: 'LATAM', label: 'Latinoamérica (USD $)', currency: 'USD' },
]

export function RegionSelector() {
  const [selectedRegion, setSelectedRegion] = useState(regions[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] px-3 py-2 rounded-xl transition-colors cursor-pointer"
        aria-label="Seleccionar región y moneda"
      >
        <span>{selectedRegion.code}</span>
        <span className="text-[var(--muted)]">({selectedRegion.currency})</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--background)] border border-[var(--border)] shadow-lg py-1 z-50">
          {regions.map((region) => (
            <button
              key={region.code}
              type="button"
              onClick={() => {
                setSelectedRegion(region)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-[var(--surface)] ${
                selectedRegion.code === region.code ? 'text-blue-600 font-bold' : 'text-[var(--foreground)]'
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}