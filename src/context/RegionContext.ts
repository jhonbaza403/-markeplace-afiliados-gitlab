'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define el tipo de dato de la región (ajústalo según tus necesidades)
export interface Region {
  id: string;
  name: string;
  code: string;
}

// Regiones por defecto de ejemplo
const DEFAULT_REGIONS: Region[] = [
  { id: '1', name: 'Global', code: 'GLOBAL' },
  { id: '2', name: 'América Latina', code: 'LATAM' },
  { id: '3', name: 'Norteamérica', code: 'NA' },
  { id: '4', name: 'Europa', code: 'EU' },
];

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  availableRegions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region>(DEFAULT_REGIONS[0]);

  return (
    <RegionContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion,
        availableRegions: DEFAULT_REGIONS,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

// Custom Hook exportado explícitamente como 'useRegion'
export const useRegion = (): RegionContextType => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion debe ser utilizado dentro de un RegionProvider');
  }
  return context;
};