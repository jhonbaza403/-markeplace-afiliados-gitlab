'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type LoginStatus = 'idle' | 'loading' | 'success' | 'error'

function getSafeRedirect(value: string | null): string {
  if (!value) {
    return '/dashboard'
  }

  // Evita open redirects.
  if (!value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }

  return value
}

function getAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase()

  if (
    normalized.includes('invalid login credentials') ||
    normalized.includes('invalid credentials')
  ) {
    return 'El correo electrónico o la contraseña no son correctos.'
  }

  if (normalized.includes('email not confirmed')) {
    return 'Tu correo electrónico todavía no ha sido verificado.'
  }

  if (normalized.includes('too many requests')) {
    return 'Se han realizado demasiados intentos. Espera unos minutos e inténtalo nuevamente.'
  }

  if (normalized.includes('user not found')) {
    return 'No fue posible iniciar sesión con esas credenciales.'
  }

  return 'No fue posible iniciar sesión. Verifica tus datos e inténtalo nuevamente.'
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = getSafeRedirect(
    searchParams.get('redirect')
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [status, setStatus] =
    useState<LoginStatus>('idle')

  const [error, setError] = useState<string | null>(null)

  const isLoading = status === 'loading'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoading) {
      return
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      setError('Introduce tu correo electrónico y contraseña.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError(null)

    try {
      const supabase = createClient()

      const {
        data,
        error: authError,
      } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (authError) {
        throw authError
      }

      if (!data.user) {
        throw new Error('AUTHENTICATION_FAILED')
      }

      setStatus('success')

      router.replace(redirectTo)
      router.refresh()
    } catch (authError: unknown) {
      console.error('Login authentication error:', authError)

      const message =
        authError instanceof Error
          ? getAuthErrorMessage(authError.message)
          : 'No fue posible iniciar sesión.'

      setError(message)
      setStatus('error')
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-md items-center justify-center">
        <section
          aria-labelledby="login-title"
          className="w-full rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-black/5 sm:p-8"
        >
          {/* Marca */}
          <div className="text-center">
            <Link
              href="/"
              aria-label="Credi Marketplace - Inicio"
              className="inline-flex items-center justify-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                C
              </span>
            </Link>

            <div className="mt-6">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Credi Marketplace
              </span>

              <h1
                id="login-title"
                className="mt-4 text-3xl font-black tracking-tight text-foreground"
              >
                Bienvenido de nuevo
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                Inicia sesión para gestionar tus compras,
                pedidos, cuenta y actividad dentro de
                Credi Marketplace.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4"
            >
              <div className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 text-destructive"
                >
                  !
                </span>

                <div>
                  <p className="text-sm font-bold text-destructive">
                    No fue posible iniciar sesión
                  </p>

                  <p className="mt-1 text-xs leading-5 text-destructive/80">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
            noValidate
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)

                  if (error) {
                    setError(null)
                    setStatus('idle')
                  }
                }}
                placeholder="tu@correo.com"
                disabled={isLoading}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="block text-xs font-black uppercase tracking-wider text-foreground"
                >
                  Contraseña
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-primary transition hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  ¿La olvidaste?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)

                  if (error) {
                    setError(null)
                    setStatus('idle')
                  }
                }}
                placeholder="Introduce tu contraseña"
                disabled={isLoading}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              aria-disabled={isLoading}
              className="flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-4 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <span
                    aria-hidden="true"
                    className="ml-2"
                  >
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Registro */}
          <div className="mt-8 border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              ¿Todavía no tienes una cuenta?
            </p>

            <Link
              href="/auth/register"
              className="mt-2 inline-flex text-sm font-black text-primary transition hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              Crear una cuenta
            </Link>
          </div>

          {/* Seguridad */}
          <div className="mt-6 rounded-2xl bg-muted/50 p-4">
            <div className="flex gap-3">
              <span
                aria-hidden="true"
                className="text-emerald-500"
              >
                ✓
              </span>

              <p className="text-[11px] leading-5 text-muted-foreground">
                Tu autenticación es gestionada mediante
                Supabase Auth. Las credenciales no son
                procesadas ni almacenadas directamente por
                esta página.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}