{/* =========================================================
            CTA
        ========================================================== */}
        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              ¿Listo para formar parte de Credi Marketplace?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Empieza a vender tus productos, contratar servicios o descubrir
              nuevas oportunidades hoy mismo.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/registro"
                className="rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500"
              >
                Crear cuenta gratis
              </Link>

              <Link
                href="/contacto"
                className="rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                Saber más
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            FOOTER
        ========================================================== */}
        <footer className="border-t border-slate-200 bg-white text-slate-600">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
              <div className="col-span-2">
                <Link
                  href="/"
                  className="text-2xl font-black tracking-tight text-slate-950"
                  aria-label="Credi Marketplace - Inicio"
                >
                  Credi
                  <span className="text-blue-600"> Marketplace</span>
                </Link>

                <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                  Conectando compradores, vendedores, profesionales y empresas
                  en una plataforma digital global.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950">
                  Navegación
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link href="/explorar" className="hover:text-blue-600">
                      Explorar
                    </Link>
                  </li>
                  <li>
                    <Link href="/ofertas" className="hover:text-blue-600">
                      Ofertas
                    </Link>
                  </li>
                  <li>
                    <Link href="/productos" className="hover:text-blue-600">
                      Productos
                    </Link>
                  </li>
                  <li>
                    <Link href="/servicios" className="hover:text-blue-600">
                      Servicios
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950">
                  Comercio
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link href="/vender" className="hover:text-blue-600">
                      Vender en Credi
                    </Link>
                  </li>
                  <li>
                    <Link href="/categorias" className="hover:text-blue-600">
                      Categorías
                    </Link>
                  </li>
                  <li>
                    <Link href="/oportunidades" className="hover:text-blue-600">
                      Oportunidades
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950">
                  Cuenta
                </h3>

                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link href="/login" className="hover:text-blue-600">
                      Ingresar
                    </Link>
                  </li>
                  <li>
                    <Link href="/registro" className="hover:text-blue-600">
                      Crear cuenta
                    </Link>
                  </li>
                  <li>
                    <Link href="/soporte" className="hover:text-blue-600">
                      Soporte
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100 pt-8 sm:flex-row">
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} Credi Marketplace. Todos los derechos reservados.
              </p>

              <div className="mt-4 flex gap-6 text-xs text-slate-500 sm:mt-0">
                <Link href="/privacidad" className="hover:text-blue-600">
                  Política de privacidad
                </Link>
                <Link href="/terminos" className="hover:text-blue-600">
                  Términos de servicio
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}