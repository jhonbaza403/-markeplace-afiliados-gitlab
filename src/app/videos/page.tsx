'use client';

import React from 'react';

export default function VideosFeedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-900 p-6 text-center border border-gray-800">
        <h2 className="text-2xl font-bold">Showcase de Videos (90s)</h2>
        <p className="mt-2 text-sm text-gray-400">
          Descubre productos y servicios explicados por sus creadores en formato corto.
        </p>

        <div className="mt-6 flex h-96 items-center justify-center rounded-xl bg-gray-800 text-gray-500">
          [ Reproductor de Video Vertical ]
        </div>

        <div className="mt-4 flex justify-around">
          <button className="rounded-full bg-gray-800 p-3 hover:bg-gray-700">❤️ Me gusta</button>
          <button className="rounded-full bg-gray-800 p-3 hover:bg-gray-700">🛒 Ver Producto</button>
          <button className="rounded-full bg-gray-800 p-3 hover:bg-gray-700">🔄 Compartir</button>
        </div>
      </div>
    </div>
  );
}