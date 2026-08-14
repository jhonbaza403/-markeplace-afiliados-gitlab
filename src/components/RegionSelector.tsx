'use client';

// ==========================================================
// ARCHIVO: src/components/RegionSelector.tsx
// Credi Marketplace
//
// Selector de región de la plataforma.
//
// Responsabilidades:
// - Mostrar las regiones disponibles.
// - Permitir cambiar la región activa.
// - Mantener sincronización con RegionContext.
// - Ser accesible mediante teclado y lectores de pantalla.
//
// IMPORTANTE:
// - No contiene lógica de negocio.
// - No accede directamente a Supabase.
// - No modifica la lista de regiones.
// - La fuente de verdad es RegionContext.
// ==========================================================

import { useId } from 'react';

import { useRegion } from '@/context/RegionContext';

// ==========================================================
// COMPONENTE
// ==========================================================

export function RegionSelector() {
  const {
    selectedRegion,
    setSelectedRegion,
    availableRegions,
  } = useRegion();

  const selectId = useId();

  // ========================================================
  // CAMBIO DE REGIÓN
  // ========================================================

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const regionId = event.target.value;

    const region = availableRegions.find(
      (item) => item.id === regionId
    );

    if (!region) {
      return;
    }

    setSelectedRegion(region);
  };

  // ========================================================
  // ESTADO SIN REGIONES
  // ========================================================

  if (availableRegions.length === 0) {
    return (
      <div
        className="inline-flex items-center rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
        role="status"
      >
        No hay regiones disponibles
      </div>
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="inline-flex items-center gap-2">
      <label
        htmlFor={selectId}
        className="sr-only"
      >
        Seleccionar región
      </label>

      <select
        id={selectId}
        value={selectedRegion?.id ?? ''}
        onChange={handleChange}
        aria-label="Seleccionar región"
        className="
          min-w-[170px]
          appearance-none
          rounded-lg
          border border-border
          bg-background
          px-3 py-2
          pr-9
          text-sm
          font-medium
          text-foreground
          shadow-sm
          outline-none
          transition-colors
          hover:bg-muted
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {availableRegions.map((region) => (
          <option
            key={region.id}
            value={region.id}
          >
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
}