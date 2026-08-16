// ==========================================================
// ARCHIVO: src/components/seller/SellerDashboard.tsx
// Credi Marketplace
//
// Panel principal del vendedor B2B
// Gestión de productos, órdenes, ventas y balance
//
// Next.js 16.3 · React 19.2 · TypeScript
// ==========================================================

'use client';

import Link from 'next/link';

interface SellerMetric {
  label: string;
  value: string;
  description: string;
}

const metrics: readonly SellerMetric[] = [
  {
    label: 'Ventas totales',
    value: '$0.00',
    description: 'Ingresos acumulados',
  },
  {
    label: 'Órdenes activas',
    value: '0',
    description: 'Pedidos pendientes',
  },
  {
    label: 'Productos',
    value: '0',
    description: 'Productos publicados',
  },
  {
    label: 'Balance disponible',
    value: '$0.00',
    description: 'Disponible para retiro',
  },
] as const;


interface SellerAction {
  title: string;
  description: string;
  href: string;
}


const actions: readonly SellerAction[] = [
  {
    title: 'Agregar producto',
    description:
      'Crear nuevos productos para el marketplace B2B.',
    href: '/seller/products/new',
  },

  {
    title: 'Administrar productos',
    description:
      'Editar precios, inventario y disponibilidad.',
    href: '/seller/products',
  },

  {
    title: 'Ver órdenes',
    description:
      'Gestionar pedidos recibidos.',
    href: '/seller/orders',
  },

  {
    title: 'Configuración comercial',
    description:
      'Datos de empresa, pagos y facturación.',
    href: '/seller/settings',
  },
] as const;


export default function SellerDashboard() {
  return (
    <section
      className="
        space-y-8
        p-6
      "
    >

      {/* Encabezado */}
      <header
        className="
          flex
          flex-col
          gap-2
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            text-gray-900
          "
        >
          Panel del vendedor
        </h1>

        <p
          className="
            text-gray-600
          "
        >
          Administra tu negocio, productos,
          órdenes y operaciones B2B.
        </p>
      </header>


      {/* Métricas */}
      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >

        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="
              rounded-xl
              border
              bg-white
              p-5
              shadow-sm
            "
          >

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              {metric.label}
            </p>

            <strong
              className="
                mt-2
                block
                text-2xl
                font-bold
                text-gray-900
              "
            >
              {metric.value}
            </strong>

            <span
              className="
                mt-1
                block
                text-sm
                text-gray-500
              "
            >
              {metric.description}
            </span>

          </article>
        ))}

      </div>


      {/* Acciones rápidas */}
      <div>

        <h2
          className="
            mb-4
            text-xl
            font-semibold
            text-gray-900
          "
        >
          Acciones rápidas
        </h2>


        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >

          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="
                rounded-xl
                border
                bg-white
                p-5
                transition
                hover:shadow-md
              "
            >

              <h3
                className="
                  font-semibold
                  text-gray-900
                "
              >
                {action.title}
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-gray-600
                "
              >
                {action.description}
              </p>

            </Link>
          ))}

        </div>

      </div>


      {/* Estado comercial */}
      <div
        className="
          rounded-xl
          border
          bg-gray-50
          p-5
        "
      >

        <h2
          className="
            font-semibold
            text-gray-900
          "
        >
          Estado de la cuenta comercial
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-gray-600
          "
        >
          Tu cuenta está preparada para gestionar
          operaciones B2B, inventario, pagos y
          liquidaciones.
        </p>

      </div>


    </section>
  );
}
