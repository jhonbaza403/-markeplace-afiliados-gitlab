// ==========================================================
// ARCHIVO: src/app/page.tsx
// Landing Page Principal del Marketplace
// ==========================================================

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white selection:bg-blue-500/30">
      {/* =========================================================
          HERO SECTION (Premium Dark)
      ========================================================== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Decoración de fondo (Glow) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-[128px]" />
          <div className="absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[128px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Plataforma Comercial Global B2B & B2C
            </span>
            
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
              El ecosistema digital para <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">crecer sin límites</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
              Compra, vende y ofrece servicios en Credi Marketplace. Conectamos empresas y profesionales con oportunidades reales en un entorno seguro y de alta conversión.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/explorar"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-900/40 transition-all duration-300 hover:scale-105 hover:bg-blue-500 sm:w-auto"
              >
                Explorar mercado
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/vender"
                className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-4 font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-slate-500 hover:bg-slate-800 sm:w-auto"
              >
                Empieza a vender
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS SECTION
      ========================================================== */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 text-center lg:grid-cols-4">
            {[
              { id: 1, name: 'Usuarios Activos', value: '+10,000' },
              { id: 2, name: 'Transacciones Seguras', value: '100%' },
              { id: 3, name: 'Países Soportados', value: '+15' },
              { id: 4, name: 'Categorías', value: '50+' },
            ].map((stat) => (
              <div key={stat.id} className="flex flex-col gap-y-2">
                <dt className="text-sm font-medium text-slate-500">{stat.name}</dt>
                <dd className="text-3xl font-black tracking-tight text-slate-900">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* =========================================================
          FEATURES SECTION
      ========================================================== */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Todo lo que necesitas para tu negocio
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Diseñamos nuestra plataforma con las mejores herramientas para que te enfoques en lo que realmente importa: vender.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 ring-1 ring-blue-500/20">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Transacciones Seguras</h3>
                <p className="mt-2 text-slate-600">Sistema de pagos protegido y verificación de identidad para operar con total tranquilidad.</p>
              </div>

              {/* Feature 2 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600 ring-1 ring-cyan-500/20">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Alcance Internacional</h3>
                <p className="mt-2 text-slate-600">Llega a clientes en diferentes países con soporte multimoneda (FIAT y Crypto).</p>
              </div>

              {/* Feature 3 */}
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 ring-1 ring-indigo-500/20">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Mercado B2B & B2C</h3>
                <p className="mt-2 text-slate-600">Herramientas especializadas tanto para ventas al detal como para compras mayoristas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA (Call to Action)
      ========================================================== */}
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
          <div className="px-6 py-20 text-center sm:px-12 sm:py-24">
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              ¿Listo para dar el siguiente salto?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
              Únete a miles de emprendedores y empresas que ya están multiplicando sus ingresos en Credi Marketplace.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/registro"
                className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-500"
              >
                Crear cuenta gratis ahora
              </Link>
              <Link
                href="/contacto"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/10"
              >
                Hablar con asesor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="border-t border-slate-200 bg-white text-slate-600">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:pr-8">
              <Link
                href="/"
                className="text-2xl font-black tracking-tight text-slate-950"
                aria-label="Credi Marketplace - Inicio"
              >
                Credi<span className="text-blue-600">Marketplace</span>
              </Link>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                La plataforma líder para conectar compradores, vendedores, profesionales y empresas en una economía digital sin fronteras.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950">Navegación</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/explorar" className="transition hover:text-blue-600">Explorar</Link></li>
                <li><Link href="/ofertas" className="transition hover:text-blue-600">Ofertas</Link></li>
                <li><Link href="/productos" className="transition hover:text-blue-600">Productos</Link></li>
                <li><Link href="/servicios" className="transition hover:text-blue-600">Servicios</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950">Comercio</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/vender" className="transition hover:text-blue-600">Vender en Credi</Link></li>
                <li><Link href="/categorias" className="transition hover:text-blue-600">Categorías</Link></li>
                <li><Link href="/b2b" className="transition hover:text-blue-600">Portal B2B</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950">Cuenta</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li><Link href="/login" className="transition hover:text-blue-600">Ingresar</Link></li>
                <li><Link href="/registro" className="transition hover:text-blue-600">Crear cuenta</Link></li>
                <li><Link href="/soporte" className="transition hover:text-blue-600">Centro de ayuda</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-100 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Credi Marketplace. Todos los derechos reservados.
            </p>
            <div className="mt-4 flex gap-6 text-sm font-medium text-slate-500 sm:mt-0">
              <Link href="/privacidad" className="transition hover:text-slate-900">Privacidad</Link>
              <Link href="/terminos" className="transition hover:text-slate-900">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}