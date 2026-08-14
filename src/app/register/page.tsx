```tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FormEvent,
  useState,
  useTransition,
} from 'react'
import { createClient } from '@/lib/supabase/client'

type PublicRole = 'customer' | 'vendor'

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  role?: string
}

const MIN_PASSWORD_LENGTH = 8

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function RegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] =
    useState<PublicRole>('customer')

  const [errors, setErrors] =
    useState<FormErrors>({})

  const [serverError, setServerError] =
    useState<string | null>(null)

  const [isPending, startTransition] =
    useTransition()

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}

    const normalizedName = fullName.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedName.length < 2) {
      nextErrors.fullName =
        'Introduce tu nombre completo.'
    }

    if (!validateEmail(normalizedEmail)) {
      nextErrors.email =
        'Introduce un correo electrónico válido.'
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password =
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword =
        'Las contraseñas no coinciden.'
    }

    if (
      role !== 'customer' &&
      role !== 'vendor'
    ) {
      nextErrors.role =
        'Selecciona un tipo de cuenta válido.'
    }

    return nextErrors
  }

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setServerError(null)

    const validationErrors = validate()

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    startTransition(async () => {
      try {
        const supabase = createClient()

        const normalizedName =
          fullName.trim()

        const normalizedEmail =
          email.trim().toLowerCase()

        const {
          data,
          error,
        } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            /*
             * Estos metadatos son auxiliares.
             *
             * La autorización definitiva NO debe depender
             * de valores enviados por el navegador.
             */
            data: {
              full_name: normalizedName,
              requested_role: role,
            },
          },
        })

        if (error) {
          const message =
            error.message.toLowerCase()

          if (
            message.includes(
              'already registered',
            )
          ) {
            setServerError(
              'Este correo electrónico ya está registrado. Intenta iniciar sesión o recuperar tu contraseña.',
            )
          } else if (
            message.includes('password')
          ) {
            setServerError(
              'La contraseña no cumple los requisitos de seguridad.',
            )
          } else if (
            message.includes('email')
          ) {
            setServerError(
              'No fue posible utilizar ese correo electrónico.',
            )
          } else {
            setServerError(
              'No fue posible crear la cuenta. Inténtalo nuevamente.',
            )
          }

          return
        }

        /*
         * Supabase puede devolver un usuario sin sesión
         * cuando está activada la confirmación por correo.
         */
        if (data.user && !data.session) {
          const query = new URLSearchParams()

          query.set(
            'email',
            normalizedEmail,
          )

          router.push(
            `/auth/verify-email?${query.toString()}`,
          )

          return
        }

        /*
         * Si el proyecto permite sesión inmediata,
         * enviamos al dashboard.
         */
        router.push('/dashboard')
        router.refresh()
      } catch (error: unknown) {
        console.error(
          'Registration error:',
          error,
        )

        setServerError(
          'Ocurrió un error inesperado. Inténtalo nuevamente.',
        )
      }
    })
  }

  const inputClassName =
    'w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12 sm:px-6">
      <section className="w-full max-w-xl">
        <div className="rounded-[2rem] border border-border bg-card p-7 shadow-2xl sm:p-10">
          <header className="text-center">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Credi Marketplace
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Crear tu cuenta
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Crea una cuenta segura para comprar,
              vender y utilizar los servicios de la
              plataforma.
            </p>
          </header>

          {serverError && (
            <div
              role="alert"
              aria-live="polite"
              className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
            >
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
            noValidate
          >
            <div>
              <label
                htmlFor="full-name"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
              >
                Nombre completo
              </label>

              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value,
                  )
                }
                disabled={isPending}
                aria-invalid={
                  Boolean(errors.fullName)
                }
                aria-describedby={
                  errors.fullName
                    ? 'full-name-error'
                    : undefined
                }
                className={inputClassName}
                placeholder="Tu nombre completo"
              />

              {errors.fullName && (
                <p
                  id="full-name-error"
                  className="mt-2 text-xs font-semibold text-destructive"
                >
                  {errors.fullName}
                </p>
              )}
            </div>

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
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                disabled={isPending}
                aria-invalid={
                  Boolean(errors.email)
                }
                aria-describedby={
                  errors.email
                    ? 'email-error'
                    : undefined
                }
                className={inputClassName}
                placeholder="tu@correo.com"
              />

              {errors.email && (
                <p
                  id="email-error"
                  className="mt-2 text-xs font-semibold text-destructive"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  disabled={isPending}
                  aria-invalid={
                    Boolean(errors.password)
                  }
                  className={inputClassName}
                  placeholder="Mínimo 8 caracteres"
                />

                {errors.password && (
                  <p className="mt-2 text-xs font-semibold text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
                >
                  Confirmar contraseña
                </label>

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value,
                    )
                  }
                  disabled={isPending}
                  aria-invalid={
                    Boolean(
                      errors.confirmPassword,
                    )
                  }
                  className={inputClassName}
                  placeholder="Repite tu contraseña"
                />

                {errors.confirmPassword && (
                  <p className="mt-2 text-xs font-semibold text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-foreground"
              >
                Tipo de cuenta
              </label>

              <select
                id="role"
                name="role"
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target
                      .value as PublicRole,
                  )
                }
                disabled={isPending}
                className={inputClassName}
              >
                <option value="customer">
                  Comprador / Cliente
                </option>

                <option value="vendor">
                  Vendedor / Tienda
                </option>
              </select>

              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                Los permisos administrativos y
                privilegios especiales se gestionan
                exclusivamente desde el servidor.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-2xl bg-primary px-5 py-4 text-sm font-black text-primary-foreground shadow-xl shadow-primary/10 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? 'Creando cuenta...'
                : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-8 border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href="/auth/login"
                className="font-black text-primary hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] leading-5 text-muted-foreground">
          Al crear una cuenta aceptas las condiciones
          aplicables de uso y las políticas de la
          plataforma.
        </p>
      </section>
    </main>
  )
}
```

}
```
