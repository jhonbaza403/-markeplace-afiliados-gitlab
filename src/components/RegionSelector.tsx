'use client';

import { useRegion } from '@/context/RegionContext';

export function RegionSelector() {
  const { selectedRegion, setSelectedRegion, availableRegions } = useRegion();

  return (
    <div className="relative inline-block text-left">
      <select
        value={selectedRegion?.id ?? ''}
        onChange={(e) => {
          const region = availableRegions.find((r) => r.id === e.target.value);
          if (region) setSelectedRegion(region);
        }}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {availableRegions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  );
}