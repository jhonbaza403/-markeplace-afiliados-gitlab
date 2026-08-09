'use client';

import React from 'react';
import { Service } from '@/types/services';

export default function ServicesPage() {
  const mockServices: Service[] = [
    {
      id: 'srv-1',
      providerId: 'user-2',
      title: 'Consultoría Legal y Contratos Comercio Exterior',
      description: 'Asesoría especializada para PYMES y vendedores globales.',
      category: 'Legal',
      pricePerUnit: 50,
      unitType: 'hour',
      currency: 'USD',
      rating: 4.9,
      reviewCount: 18,
      region: 'global',
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">Servicios Profesionales</h1>
        <p className="mt-2 text-gray-600">
          Encuentra especialistas, consultores y técnicos en todo el mundo.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockServices.map((service) => (
            <div key={service.id} className="rounded-lg border bg-white p-6 shadow-sm">
              <span className="text-xs font-semibold uppercase text-indigo-600">
                {service.category}
              </span>
              <h3 className="mt-2 text-xl font-bold text-gray-900">{service.title}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{service.description}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="text-lg font-bold text-gray-900">
                  ${service.pricePerUnit} / {service.unitType}
                </span>
                <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white font-medium hover:bg-indigo-700">
                  Contratar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}