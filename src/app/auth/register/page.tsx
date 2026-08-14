'use client'

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type AccountRole = 'customer' | 'vendor'

interface FormState {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: AccountRole
}

interface FieldErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function getPasswordStrength(password: string) {
  let score = 0

  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  return score
}

function translateAuthError(message: string) {
  const normalized = message.toLowerCase()

  if (
    normalized.includes('user already registered') ||
    normalized.includes('already been registered')
  ) {
    return 'Este correo electrónico ya está registrado. Intenta iniciar sesión.'
  }

  if (normalized.includes('invalid email')) {
    return 'Introduce un correo electrónico válido.'
  }

  if (normalized.includes('password')) {
    return 'La contraseña no cumple los requisitos de seguridad.'
  }

  if (normalized.includes('rate limit')) {
    return 'Se han realizado demasiados intentos. Espera unos minutos e inténtalo nuevamente.'
  }

  if (normalized.includes('email provider')) {
    return 'El servicio de correo electrónico no está disponible temporalmente.'
  }

  return 'No fue posible crear la cuenta. Verifica los datos e inténtalo nuevamente.'
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  })

  const [errors, setErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password],
  )

  const passwordLabel = useMemo(() => {
    if (!form.password) return ''
    if (passwordStrength <= 2) return 'Débil'
    if (passwordStrength === 3) return 'Aceptable'
    if (passwordStrength === 4) return 'Fuerte'
    return 'Excelente'
  }, [form.password, passwordStrength])

  const redirectTo = useMemo(() => {
    const requested = searchParams.get('redirectTo')

    if (!requested) return '/dashboard'

    // Solo permitimos rutas internas.
    if (!requested.startsWith('/') || requested.startsWith('//')) {
      return '/dashboard'
    }

    return requested
  }, [searchParams])

  const updateField = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setForm((previous) => ({
        ...previous,
        [field]: value,
      }))

      setErrors((previous) => ({
        ...previous,
        [field]: undefined,
      }))

      setErrorMessage(null)
    },
    [],
  )

  const validateForm = useCallback((): FieldErrors => {
    const nextErrors: FieldErrors = {}

    const fullName = form.fullName.trim()
    const email = normalizeEmail(form.email)
    const password = form.password
    const confirmPassword = form.confirmPassword

    if (fullName.length < 3) {
      nextErrors.fullName = 'Introduce tu nombre completo.'
    }

    if (fullName.length > 100) {
      nextErrors.fullName = 'El nombre es demasiado largo.'
    }

    if (!email) {
      nextErrors.email = 'El correo electrónico es obligatorio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Introduce un correo electrónico válido.'
    }

    if (password.length < 8) {
      nextErrors.password =
        'La contraseña debe contener al menos 8 caracteres.'
    }

    if (!/[A-Z]/.test(password)) {
      nextErrors.password =
        'La contraseña debe incluir al menos una letra mayúscula.'
    }

    if (!/[a-z]/.test(password)) {
      nextErrors.password =
        'La contraseña debe incluir al menos una letra minúscula.'
    }

    if (!/[0-9]/.test(password)) {
      nextErrors.password =
        'La contraseña debe incluir al menos un número.'
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    return nextErrors
  }, [form])

  useEffect(() => {
    if (form.password && form.confirmPassword) {
      setErrors((previous) => ({
        ...previous,
        confirmPassword:
          form.password === form.confirmPassword
            ? undefined
            : 'Las contraseñas no coinciden.',
      }))
    }
  }, [form.password, form.confirmPassword])

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loading) return

    setErrorMessage(null)
    setSuccessMessage(null)

    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const email = normalizeEmail(form.email)
      const fullName = form.fullName.trim()

      /*
       * IMPORTANTE:
       *
       * El rol enviado en metadata NO debe considerarse una fuente
       * confiable de autorización.
       *
       * La autorización definitiva debe establecerse en servidor,
       * mediante trigger/RPC/Server Action y políticas RLS.
       *
       * Para una cuenta vendor recomendamos posteriormente un flujo
       * de aprobación administrativa.
       */

      const { data, error } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: {
          emailRedirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                  redirectTo,
                )}`
              : undefined,

          data: {
            full_name: fullName,

            /*
             * Metadata informativa únicamente.
             * NO usar auth.user.user_metadata.role para autorizar
             * operaciones administrativas.
             */
            requested_role: form.role,
          },
        },
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error('No fue posible crear la cuenta.')
      }

      /*
       * Cuando Supabase requiere confirmación por correo,
       * session normalmente será null.
       */
      if (!data.session) {
        setSuccessMessage(
          'Cuenta creada correctamente. Revisa tu correo electrónico para confirmar tu cuenta y continuar.',
        )

        setForm((previous) => ({
          ...previous,
          password: '',
          confirmPassword: '',
        }))

        return
      }

      /*
       * Si el proyecto tiene confirmación de email deshabilitada,
       * podemos continuar directamente.
       */
      router.replace(redirectTo)
      router.refresh()
    } catch (error: unknown) {
      console.error('Error durante el registro:', error)

      const message =
        error instanceof Error
          ? translateAuthError(error.message)
          : 'No fue posible crear la cuenta. Inténtalo nuevamente.'

      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambientación premium */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <section
        aria-labelledby="register-title"
        className="relative z-10 w-full max-w-xl"
      >
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/10">
          {/* Header */}
          <div className="border-b border-border px-6 py-8 sm:px-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Credi Marketplace
                </span>

                <h1
                  id="register-title"
                  className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl"
                >
                  Crear una cuenta
                </h1>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Compra, vende y participa en el ecosistema comercial de
                  Credi Marketplace.
                </p>
              </div>

              <div
                aria-hidden="true"
                className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-xl font-black text-primary sm:flex"
              >
                C
              </div>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-10 sm:py-8">
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4"
              >
                <div className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-xs font-black text-red-500"
                  >
                    !
                  </span>

                  <p className="text-sm leading-6 text-red-500">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4"
              >
                <div className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-black text-emerald-500"
                  >
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-emerald-500">
                    {successMessage}
                  </p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleRegister}
              noValidate
              className="space-y-6"
            >
              {/* Nombre */}
              <div>
                <label
                  htmlFor="full-name"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                >
                  Nombre completo
                </label>

                <input
                  id="full-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={form.fullName}
                  onChange={(event) =>
                    updateField('fullName', event.target.value)
                  }
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={
                    errors.fullName ? 'full-name-error' : undefined
                  }
                  disabled={loading}
                  placeholder="Juan Pérez"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {errors.fullName && (
                  <p
                    id="full-name-error"
                    className="mt-2 text-xs font-semibold text-red-500"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

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
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={(event) =>
                    updateField('email', event.target.value)
                  }
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'email-error' : undefined
                  }
                  disabled={loading}
                  placeholder="tu@correo.com"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-xs font-semibold text-red-500"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                >
                  Contraseña
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(event) =>
                      updateField('password', event.target.value)
                    }
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="password-help"
                    disabled={loading}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 pr-20 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-bold text-muted-foreground transition hover:text-foreground disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                <div className="mt-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition ${
                          passwordStrength >= level
                            ? 'bg-primary'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {passwordLabel && (
                    <p
                      id="password-help"
                      className="mt-2 text-[11px] font-semibold text-muted-foreground"
                    >
                      Seguridad de contraseña:{' '}
                      <span className="text-foreground">
                        {passwordLabel}
                      </span>
                    </p>
                  )}
                </div>

                {errors.password && (
                  <p className="mt-2 text-xs font-semibold text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirmación */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                >
                  Confirmar contraseña
                </label>

                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField(
                        'confirmPassword',
                        event.target.value,
                      )
                    }
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? 'confirm-password-error'
                        : undefined
                    }
                    disabled={loading}
                    placeholder="Repite tu contraseña"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 pr-20 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-bold text-muted-foreground transition hover:text-foreground disabled:opacity-50"
                    aria-label={
                      showConfirmPassword
                        ? 'Ocultar confirmación'
                        : 'Mostrar confirmación'
                    }
                  >
                    {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="mt-2 text-xs font-semibold text-red-500"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Tipo de cuenta */}
              <fieldset>
                <legend className="mb-3 block text-xs font-black uppercase tracking-wider text-foreground">
                  Tipo de cuenta
                </legend>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      form.role === 'customer'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      checked={form.role === 'customer'}
                      onChange={() =>
                        updateField('role', 'customer')
                      }
                      disabled={loading}
                      className="sr-only"
                    />

                    <span className="block text-sm font-black text-foreground">
                      Comprador
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      Compra productos y servicios dentro del marketplace.
                    </span>
                  </label>

                  <label
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      form.role === 'vendor'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="vendor"
                      checked={form.role === 'vendor'}
                      onChange={() =>
                        updateField('role', 'vendor')
                      }
                      disabled={loading}
                      className="sr-only"
                    />

                    <span className="block text-sm font-black text-foreground">
                      Vendedor
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      Publica productos y administra tu actividad comercial.
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* Seguridad */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="text-emerald-500"
                  >
                    ✓
                  </span>

                  <p className="text-[11px] leading-5 text-muted-foreground">
                    Tu contraseña se procesa mediante Supabase Auth.
                    Nunca almacenamos contraseñas directamente en el
                    perfil público.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-sm font-black text-primary-foreground shadow-xl shadow-primary/10 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                    />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear mi cuenta
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-muted-foreground">
                Al registrarte aceptas las condiciones de uso y las
                políticas aplicables de la plataforma.
              </p>

              <div className="border-t border-border pt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    href={`/auth/login${
                      redirectTo !== '/dashboard'
                        ? `?redirectTo=${encodeURIComponent(redirectTo)}`
                        : ''
                    }`}
                    className="font-black text-primary transition hover:opacity-80"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}