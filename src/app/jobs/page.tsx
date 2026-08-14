```tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ==========================================================
// TIPOS
// ==========================================================

interface Job {
  id: string;
  title: string;
  company: string | null;
  description: string | null;
  location: string | null;
  salary: string | null;
  created_at?: string | null;
}

// ==========================================================
// UTILIDADES
// ==========================================================

function formatDate(date?: string | null): string {
  if (!date) return 'Fecha no disponible';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Fecha no disponible';
  }

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function JobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================================
  // CARGAR OFERTAS
  // ========================================================

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error: queryError } = await supabase
        .from('jobs')
        .select(
          'id, title, company, description, location, salary, created_at'
        )
        .order('created_at', {
          ascending: false,
        });

      if (queryError) {
        throw queryError;
      }

      setJobs((data as Job[]) ?? []);
    } catch (err: unknown) {
      console.error(
        '[JobsPage] Error al cargar ofertas:',
        err
      );

      setJobs([]);

      setError(
        'No fue posible cargar las oportunidades de empleo. Inténtalo nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================================
  // INICIALIZACIÓN
  // ========================================================

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  // ========================================================
  // LOADING
  // ========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="space-y-3">
              <div className="h-8 w-72 rounded-lg bg-muted" />
              <div className="h-4 w-full max-w-2xl rounded bg-muted" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-64 rounded-2xl border border-border bg-card"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
                Oportunidades profesionales
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Bolsa de Empleo
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Descubre oportunidades profesionales, conecta con empresas
                y encuentra el próximo reto para impulsar tu carrera.
              </p>
            </div>

            <Link
              href="/jobs/create"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="mr-2 text-lg leading-none">+</span>
              Publicar Vacante
            </Link>
          </div>
        </header>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <section
            role="alert"
            className="mb-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-foreground">
                  No pudimos cargar las vacantes
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void fetchJobs()}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Reintentar
              </button>
            </div>
          </section>
        )}

        {/* ==================================================
            RESUMEN
        ================================================== */}

        {!error && jobs.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {jobs.length}{' '}
                {jobs.length === 1
                  ? 'oportunidad disponible'
                  : 'oportunidades disponibles'}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Ordenadas por publicación más reciente.
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            ESTADO VACÍO
        ================================================== */}

        {!error && jobs.length === 0 && (
          <section className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-2xl">
              💼
            </div>

            <h2 className="mt-5 text-xl font-bold text-foreground">
              Aún no hay vacantes publicadas
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Sé uno de los primeros empleadores en publicar una
              oportunidad profesional en Credi Marketplace.
            </p>

            <Link
              href="/jobs/create"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Publicar primera vacante
            </Link>
          </section>
        )}

        {/* ==================================================
            LISTADO
        ================================================== */}

        {!error && jobs.length > 0 && (
          <section
            aria-label="Listado de oportunidades de empleo"
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {jobs.map((job) => (
              <article
                key={job.id}
                className="group flex min-h-[290px] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>

                  {/* Empresa */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                        {(job.company?.trim()?.charAt(0) || 'E').toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {job.company?.trim() || 'Empresa confidencial'}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Publicado {formatDate(job.created_at)}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-border bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Empleo
                    </span>
                  </div>

                  {/* Título */}
                  <h2 className="mt-6 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {job.title}
                  </h2>

                  {/* Ubicación */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <span aria-hidden="true">📍</span>
                    <span>
                      {job.location?.trim() || 'Modalidad no especificada'}
                    </span>
                  </div>

                  {/* Descripción */}
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {job.description?.trim() ||
                      'El empleador no ha proporcionado una descripción detallada de esta oportunidad.'}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6 border-t border-border pt-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Remuneración
                      </p>

                      <p className="mt-1 text-base font-bold text-foreground">
                        {job.salary?.trim() || 'A convenir'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        router.push(
                          `/jobs/${encodeURIComponent(job.id)}`
                        );
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Ver oportunidad
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ==================================================
            CTA EMPLEADORES
        ================================================== */}

        {!error && jobs.length > 0 && (
          <section className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="px-6 py-8 sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Para empresas y organizaciones
                </span>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  Encuentra el talento que necesitas
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Publica tu vacante y conecta con profesionales
                  que buscan nuevas oportunidades.
                </p>
              </div>

              <Link
                href="/jobs/create"
                className="mt-6 inline-flex shrink-0 items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted lg:mt-0"
              >
                Publicar una vacante
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
```
