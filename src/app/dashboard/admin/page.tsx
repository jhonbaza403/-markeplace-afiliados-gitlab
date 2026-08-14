'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

interface Store {
  id: string
  name: string
  is_approved: boolean
  vendor_id: string
}

type ApprovalFilter = 'all' | 'approved' | 'pending'

export default function AdminDashboardPage() {
  const { user, profile, loading } = useAuth()

  const [stores, setStores] = useState<Store[]>([])
  const [fetching, setFetching] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<ApprovalFilter>('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchStores = useCallback(async () => {
    if (!user || profile?.role !== 'admin') {
      setFetching(false)
      return
    }

    setFetching(true)
    setError(null)

    try {
      const { data, error: storesError } = await supabase
        .from('stores')
        .select('id, name, is_approved, vendor_id')
        .order('name', { ascending: true })

      if (storesError) {
        throw storesError
      }

      setStores(data ?? [])
    } catch (err) {
      console.error('Error al cargar las tiendas:', err)
      setError('No fue posible cargar las tiendas. Intenta nuevamente.')
    } finally {
      setFetching(false)
    }
  }, [user, profile?.role])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const toggleApproval = async (
    storeId: string,
    currentStatus: boolean
  ) => {
    if (updatingId) return

    const nextStatus = !currentStatus

    setUpdatingId(storeId)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('stores')
        .update({ is_approved: nextStatus })
        .eq('id', storeId)

      if (updateError) {
        throw updateError
      }

      setStores((currentStores) =>
        currentStores.map((store) =>
          store.id === storeId
            ? { ...store, is_approved: nextStatus }
            : store
        )
      )
    } catch (err) {
      console.error('Error al actualizar el estado de la tienda:', err)
      setError(
        nextStatus
          ? 'No fue posible aprobar la tienda.'
          : 'No fue posible revocar la aprobación.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredStores = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return stores.filter((store) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'approved' && store.is_approved) ||
        (filter === 'pending' && !store.is_approved)

      const matchesSearch =
        !normalizedSearch ||
        store.name.toLowerCase().includes(normalizedSearch) ||
        store.vendor_id.toLowerCase().includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [stores, filter, search])

  const totalStores = stores.length
  const approvedStores = stores.filter((store) => store.is_approved).length
  const pendingStores = totalStores - approvedStores

  if (loading || fetching) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <div className="w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-blue-600" />
            <h2 className="text-lg font-bold">
              Cargando administración
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Preparando el centro de control de la plataforma...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-[var(--card)] p-8 text-center shadow-xl dark:border-red-900/40">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
              🔒
            </div>

            <h1 className="mt-5 text-2xl font-black tracking-tight">
              Acceso restringido
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Esta sección está reservada exclusivamente para administradores
              autorizados de Credi Marketplace.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Administración
              </span>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Centro de Control
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Supervisa tiendas, vendedores y procesos de aprobación
                desde un único centro administrativo.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchStores}
              disabled={fetching}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-bold shadow-sm transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ↻ Actualizar datos
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-600 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Metrics */}
        <section
          aria-label="Métricas administrativas"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <MetricCard
            label="Tiendas registradas"
            value={totalStores}
            icon="🏪"
            description="Total en la plataforma"
          />

          <MetricCard
            label="Tiendas aprobadas"
            value={approvedStores}
            icon="✓"
            description="Operación autorizada"
            accent="emerald"
          />

          <MetricCard
            label="Pendientes"
            value={pendingStores}
            icon="!"
            description="Requieren revisión"
            accent="amber"
          />
        </section>

        {/* Main panel */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl">

          {/* Toolbar */}
          <div className="border-b border-[var(--border)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div>
                <h2 className="text-lg font-black">
                  Gestión de tiendas
                </h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Revisa y administra el estado comercial de cada vendedor.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                    ⌕
                  </span>

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar tienda o vendedor..."
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-9 pr-4 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 sm:w-72"
                  />
                </div>

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value as ApprovalFilter)
                  }
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-500"
                >
                  <option value="all">Todas las tiendas</option>
                  <option value="approved">Aprobadas</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {filteredStores.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface)] text-2xl">
                🏪
              </div>

              <h3 className="mt-5 text-lg font-bold">
                No se encontraron tiendas
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                {search
                  ? 'No existen tiendas que coincidan con los criterios de búsqueda.'
                  : 'Todavía no existen tiendas registradas en la plataforma.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                        Tienda
                      </th>

                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                        Vendedor
                      </th>

                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                        Estado
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--border)]">
                    {filteredStores.map((store) => {
                      const updating = updatingId === store.id

                      return (
                        <tr
                          key={store.id}
                          className="transition hover:bg-[var(--surface-hover)]"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                                🏪
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-bold">
                                  {store.name || 'Tienda sin nombre'}
                                </p>

                                <p className="mt-0.5 font-mono text-[10px] text-[var(--muted)]">
                                  ID: {store.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="font-mono text-xs text-[var(--muted)]">
                              {store.vendor_id}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge approved={store.is_approved} />
                          </td>

                          <td className="px-6 py-5 text-right">
                            <ApprovalButton
                              approved={store.is_approved}
                              loading={updating}
                              onClick={() =>
                                toggleApproval(
                                  store.id,
                                  store.is_approved
                                )
                              }
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-[var(--border)] md:hidden">
                {filteredStores.map((store) => {
                  const updating = updatingId === store.id

                  return (
                    <div key={store.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                            🏪
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-bold">
                              {store.name || 'Tienda sin nombre'}
                            </h3>

                            <p className="mt-1 truncate font-mono text-[10px] text-[var(--muted)]">
                              {store.vendor_id}
                            </p>
                          </div>
                        </div>

                        <StatusBadge approved={store.is_approved} />
                      </div>

                      <div className="mt-5">
                        <ApprovalButton
                          approved={store.is_approved}
                          loading={updating}
                          onClick={() =>
                            toggleApproval(
                              store.id,
                              store.is_approved
                            )
                          }
                          fullWidth
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Footer */}
          {filteredStores.length > 0 && (
            <div className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-xs text-[var(--muted)] sm:px-6">
              Mostrando{' '}
              <span className="font-bold text-[var(--foreground)]">
                {filteredStores.length}
              </span>{' '}
              de{' '}
              <span className="font-bold text-[var(--foreground)]">
                {totalStores}
              </span>{' '}
              tiendas registradas.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------- */
/* Components                                                                  */
/* -------------------------------------------------------------------------- */

function MetricCard({
  label,
  value,
  icon,
  description,
  accent = 'blue',
}: {
  label: string
  value: number
  icon: string
  description: string
  accent?: 'blue' | 'emerald' | 'amber'
}) {
  const accentClasses = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--muted)]">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black ${accentClasses[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ approved }: { approved: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
        approved
          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          approved ? 'bg-emerald-500' : 'bg-amber-500'
        }`}
      />

      {approved ? 'Aprobada' : 'Pendiente'}
    </span>
  )
}

function ApprovalButton({
  approved,
  loading,
  onClick,
  fullWidth = false,
}: {
  approved: boolean
  loading: boolean
  onClick: () => void
  fullWidth?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`rounded-xl px-4 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
        approved
          ? 'border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400'
          : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500'
      } ${fullWidth ? 'w-full' : ''}`}
    >
      {loading
        ? 'Actualizando...'
        : approved
          ? 'Revocar aprobación'
          : 'Aprobar tienda'}
    </button>
  )
}