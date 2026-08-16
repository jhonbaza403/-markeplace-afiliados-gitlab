'use client';

import { useMemo } from 'react';

type DemandLevel = 'high' | 'explosive' | 'medium';

interface TrendingItem {
  id: string;
  name: string;
  category: string;
  growth: string;
  bestPlatform: string;
  suggestedHashtags: string[];
  demandLevel: DemandLevel;
}

interface TrendsSummary {
  topPlatform: string;
  topFormat: string;
  peakWindow: string;
}

const DEFAULT_TRENDS: readonly TrendingItem[] = [
  {
    id: 'technology-tws',
    name: 'Gadgets tecnológicos y auriculares TWS',
    category: 'Electrónica',
    growth: '+320%',
    bestPlatform: 'TikTok e Instagram Reels',
    suggestedHashtags: [
      '#Tecnologia',
      '#Gadgets2026',
      '#Ofertas',
    ],
    demandLevel: 'explosive',
  },
  {
    id: 'ai-academic',
    name: 'Contenido académico y productos relacionados con IA',
    category: 'Educación y Ciencia',
    growth: '+185%',
    bestPlatform: 'LinkedIn y Telegram',
    suggestedHashtags: [
      '#Ciencia',
      '#Investigacion',
      '#IA',
    ],
    demandLevel: 'high',
  },
  {
    id: 'summer-fashion',
    name: 'Moda y accesorios de temporada',
    category: 'Moda',
    growth: '+140%',
    bestPlatform: 'Instagram y Pinterest',
    suggestedHashtags: [
      '#Moda2026',
      '#OutfitInspo',
      '#Tendencias',
    ],
    demandLevel: 'high',
  },
];

const DEFAULT_SUMMARY: TrendsSummary = {
  topPlatform: 'Pendiente de datos',
  topFormat: 'Pendiente de datos',
  peakWindow: 'Pendiente de datos',
};

function getDemandLabel(level: DemandLevel): string {
  switch (level) {
    case 'explosive':
      return 'Demanda explosiva';

    case 'high':
      return 'Demanda alta';

    case 'medium':
      return 'Demanda media';

    default:
      return 'Demanda no determinada';
  }
}

function getDemandClasses(level: DemandLevel): string {
  switch (level) {
    case 'explosive':
      return [
        'bg-rose-500/10',
        'text-rose-600',
        'dark:text-rose-400',
        'border',
        'border-rose-500/20',
      ].join(' ');

    case 'high':
      return [
        'bg-amber-500/10',
        'text-amber-600',
        'dark:text-amber-400',
        'border',
        'border-amber-500/20',
      ].join(' ');

    case 'medium':
      return [
        'bg-blue-500/10',
        'text-blue-600',
        'dark:text-blue-400',
        'border',
        'border-blue-500/20',
      ].join(' ');

    default:
      return [
        'bg-muted',
        'text-muted-foreground',
        'border',
        'border-border',
      ].join(' ');
  }
}

export default function TrendsPanel() {
  const trends = useMemo(() => DEFAULT_TRENDS, []);

  /*
   * Esta información se mantiene separada de las tendencias
   * para poder sustituirla posteriormente por datos reales
   * provenientes de Supabase o del servicio de inteligencia
   * comercial.
   */
  const summary = DEFAULT_SUMMARY;

  return (
    <section
      className="my-8 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-md"
      aria-labelledby="trends-panel-title"
    >
      {/* =====================================================
          CABECERA
      ====================================================== */}

      <header className="mb-6 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-3 w-3 rounded-full bg-emerald-500"
              aria-hidden="true"
            />

            <h2
              id="trends-panel-title"
              className="text-xl font-bold text-foreground"
            >
              Inteligencia Comercial y Tendencias
            </h2>
          </div>

          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            Panel preparado para analizar señales de demanda, categorías,
            comportamiento comercial y oportunidades de publicación.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          Datos de demostración
        </span>
      </header>

      {/* =====================================================
          MÉTRICAS
      ====================================================== */}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          title="Red con mayor conversión"
          value={summary.topPlatform}
          description="Se mostrará cuando exista información analítica suficiente."
        />

        <SummaryCard
          title="Formato de mayor rendimiento"
          value={summary.topFormat}
          description="Se calculará a partir de datos reales de interacción y conversión."
        />

        <SummaryCard
          title="Horario de mayor demanda"
          value={summary.peakWindow}
          description="Se determinará mediante datos históricos y regionales."
        />
      </div>

      {/* =====================================================
          TENDENCIAS
      ====================================================== */}

      <div className="mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Tendencias detectadas
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Indicadores orientativos preparados para futura conexión con el
          motor de inteligencia comercial.
        </p>
      </div>

      <div className="space-y-4">
        {trends.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4 transition hover:border-emerald-500/50 hover:shadow-sm md:flex-row md:items-center"
          >
            {/* Información principal */}

            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${getDemandClasses(
                    item.demandLevel
                  )}`}
                >
                  {getDemandLabel(item.demandLevel)}
                </span>

                <span className="text-xs font-medium text-muted-foreground">
                  {item.category}
                </span>
              </div>

              <h4 className="font-bold text-foreground">
                {item.name}
              </h4>

              <div className="flex flex-wrap gap-1.5">
                {item.suggestedHashtags.map((hashtag) => (
                  <span
                    key={hashtag}
                    className="text-xs text-muted-foreground"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>

            {/* Métricas */}

            <div className="flex shrink-0 flex-col gap-3 border-t border-border pt-3 md:flex-row md:items-center md:gap-6 md:border-t-0 md:pt-0">
              <Metric
                label="Crecimiento de interés"
                value={item.growth}
                highlight
              />

              <Metric
                label="Canal recomendado"
                value={item.bestPlatform}
              />
            </div>
          </article>
        ))}
      </div>

      {/* =====================================================
          AVISO DE DATOS
      ====================================================== */}

      <footer className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">
            Inteligencia comercial:
          </strong>{' '}
          los indicadores de este panel deben considerarse demostrativos
          hasta que sean alimentados por fuentes verificables. La versión
          productiva deberá calcular las métricas mediante datos reales,
          evitando presentar estimaciones como hechos.
        </p>
      </footer>
    </section>
  );
}

/* ==========================================================
   COMPONENTES AUXILIARES
========================================================== */

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
}

function SummaryCard({
  title,
  value,
  description,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <span className="text-xs font-bold uppercase text-muted-foreground">
        {title}
      </span>

      <p className="mt-1 text-xl font-extrabold text-foreground">
        {value}
      </p>

      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function Metric({
  label,
  value,
  highlight = false,
}: MetricProps) {
  return (
    <div className="text-left md:text-right">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p
        className={
          highlight
            ? 'text-lg font-black text-emerald-600 dark:text-emerald-400'
            : 'text-xs font-bold text-foreground'
        }
      >
        {value}
      </p>
    </div>
  );
}
