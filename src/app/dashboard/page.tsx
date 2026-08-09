'use client';

import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Cargando panel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido, {user?.fullName || 'Usuario'}
        </h1>
        <p className="mt-2 text-gray-600">
          Gestiona tus compras, ventas, servicios y publicaciones desde un solo lugar.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">Mis Productos</h3>
            <p className="mt-2 text-sm text-gray-500">Publica y administra tus productos en venta.</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">Mis Servicios</h3>
            <p className="mt-2 text-sm text-gray-500">Ofrece tus servicios profesionales.</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-xl font-semibold">Mis Ofertas / Empleos</h3>
            <p className="mt-2 text-sm text-gray-500">Administra vacantes y contrataciones.</p>
          </div>
        </div>
      </div>
    </div>
  );
}