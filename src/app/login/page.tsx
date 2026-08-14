```tsx
'use client';

import {
  FormEvent,
  useCallback,
  useState,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

/* ==========================================================
   TIPOS
========================================================== */

type LoginErrorCode =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'too_many_requests'
  | 'generic';

/* ==========================================================
   UTILIDADES
========================================================== */

function getLoginErrorMessage(
  error: unknown
): {
  code: LoginErrorCode;
  message: string;
} {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : '';

  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials')
  ) {
    return {
      code: 'invalid_credentials',
      message:
        'El correo electrónico o la contraseña no son correctos.',
    };
  }

  if (
    message.includes('email not confirmed') ||
    message.includes('email_not_confirmed')
  ) {
    return {
      code: 'email_not_confirmed',
      message:
        'Debes confirmar tu correo electrónico antes de iniciar sesión.',
    };
  }

  if (
    message.includes('too many requests') ||
    message.includes('rate limit')
  ) {
    return {
      code: 'too_many_requests',
      message:
        'Se han realizado demasiados intentos. Espera unos minutos e inténtalo nuevamente.',
    };
  }

  return {
    code: 'generic',
    message:
      'No fue posible iniciar sesión. Verifica tus datos e inténtalo nuevamente.',
  };
}

/* ==========================================================
   COMPONENTE
========================================================== */

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* ========================================================
     CAMBIO EMAIL
  ======================================================== */

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      setError(null);
    },
    []
  );

  /* ========================================================
     CAMBIO PASSWORD
  ======================================================== */

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      setError(null);
    },
    []
  );

  /* ========================================================
     LOGIN
  ======================================================== */

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (loading) {
        return;
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        setError(
          'Ingresa tu correo electrónico y contraseña.'
        );
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const supabase =
          createClient();

        const {
          error: signInError,
        } =
          await supabase.auth.signInWithPassword(
            {
              email: normalizedEmail,
              password,
            }
          );

        if (signInError) {
          throw signInError;
        }

        /*
         * El AuthContext detectará el cambio de sesión.
         * refresh() permite actualizar Server Components
         * que dependan del estado autenticado.
         */

        router.push('/dashboard');
        router.refresh();
      } catch (error) {
        const result =
          getLoginErrorMessage(error);

        setError(result.message);
      } finally {
        setLoading(false);
      }
    },
    [
      email,
      password,
      loading,
      router,
    ]
  );

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-4
        py-12
        text-foreground
        sm:px-6
      "
    >
      {/* =====================================================
          DECORACIÓN DE FONDO
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-32
            -top-32
            size-80
            rounded-full
            bg-primary/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-40
            size-96
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />
      </div>

      {/* =====================================================
          CONTENEDOR
      ====================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >
        {/* ===================================================
            MARCA
        ==================================================== */}

        <div className="mb-8 text-center">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              rounded-xl
              text-2xl
              font-black
              tracking-tight
              text-foreground
              transition-opacity
              hover:opacity-80
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2
            "
            aria-label="Credi Marketplace - Inicio"
          >
            <span>Credi</span>

            <span
              className="
                ml-1
                bg-linear-to-r
                from-brand-600
                to-cyan-500
                bg-clip-text
                text-transparent
              "
            >
              Marketplace
            </span>
          </Link>

          <p className="mt-3 text-sm text-muted-foreground">
            Accede a tu cuenta y continúa
            dentro del ecosistema Credi.
          </p>
        </div>

        {/* ===================================================
            TARJETA
        ==================================================== */}

        <section
          className="
            overflow-hidden
            rounded-3xl
            border
            border-border
            bg-card
            p-6
            shadow-2xl
            shadow-black/5
            sm:p-8
          "
        >
          {/* =================================================
              CABECERA
          ================================================== */}

          <div className="mb-7">
            <div
              className="
                flex
                size-12
                items-center
                justify-center
                rounded-2xl
                bg-primary/10
                text-primary
              "
            >
              <LogIn
                aria-hidden="true"
                className="size-6"
              />
            </div>

            <h1
              className="
                mt-5
                text-3xl
                font-black
                tracking-tight
                text-foreground
              "
            >
              Bienvenido de nuevo
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Inicia sesión para administrar tus
              compras, ventas y servicios.
            </p>
          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="
                mb-6
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/10
                px-4
                py-3
                text-sm
                leading-5
                text-red-700
                dark:text-red-300
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              FORMULARIO
          ================================================== */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {/* EMAIL */}

            <div>
              <label
                htmlFor="login-email"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-foreground
                "
              >
                Correo electrónico
              </label>

              <input
                id="login-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={email}
                onChange={(event) =>
                  handleEmailChange(
                    event.target.value
                  )
                }
                placeholder="tu@correo.com"
                disabled={loading}
                className="
                  min-h-12
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  text-sm
                  text-foreground
                  outline-none
                  transition-all
                  placeholder:text-muted-foreground
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            {/* PASSWORD */}

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="login-password"
                  className="
                    text-sm
                    font-bold
                    text-foreground
                  "
                >
                  Contraseña
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="
                    text-xs
                    font-bold
                    text-primary
                    transition-opacity
                    hover:opacity-80
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2
                  "
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    size-4
                    -translate-y-1/2
                    text-muted-foreground
                  "
                />

                <input
                  id="login-password"
                  name="password"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) =>
                    handlePasswordChange(
                      event.target.value
                    )
                  }
                  placeholder="Introduce tu contraseña"
                  disabled={loading}
                  className="
                    min-h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    py-3
                    pl-11
                    pr-12
                    text-sm
                    text-foreground
                    outline-none
                    transition-all
                    placeholder:text-muted-foreground
                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    size-9
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-muted-foreground
                    transition-colors
                    hover:bg-muted
                    hover:text-foreground
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    disabled:opacity-50
                  "
                >
                  {showPassword ? (
                    <EyeOff
                      aria-hidden="true"
                      className="size-4"
                    />
                  ) : (
                    <Eye
                      aria-hidden="true"
                      className="size-4"
                    />
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary
                px-5
                py-3
                text-sm
                font-black
                text-primary-foreground
                shadow-lg
                shadow-primary/15
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:opacity-90
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-primary/20
                focus-visible:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
              "
            >
              {loading ? (
                <>
                  <span
                    aria-hidden="true"
                    className="
                      size-4
                      animate-spin
                      rounded-full
                      border-2
                      border-current
                      border-t-transparent
                    "
                  />

                  Verificando acceso...
                </>
              ) : (
                <>
                  <LogIn
                    aria-hidden="true"
                    className="size-4"
                  />

                  Iniciar sesión

                  <ArrowRight
                    aria-hidden="true"
                    className="size-4"
                  />
                </>
              )}
            </button>
          </form>

          {/* =================================================
              REGISTRO
          ================================================== */}

          <div className="mt-7 border-t border-border pt-6">
            <p className="text-center text-sm text-muted-foreground">
              ¿Todavía no tienes una cuenta?
            </p>

            <Link
              href="/auth/register"
              className="
                mt-3
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-2.5
                text-sm
                font-bold
                text-foreground
                transition-all
                hover:bg-muted
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary
                focus-visible:ring-offset-2
              "
            >
              <UserPlus
                aria-hidden="true"
                className="size-4"
              />

              Crear una cuenta
            </Link>
          </div>
        </section>

        {/* ===================================================
            SEGURIDAD
        ==================================================== */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-center
            gap-2
            text-center
            text-xs
            text-muted-foreground
          "
        >
          <ShieldCheck
            aria-hidden="true"
            className="size-4 text-emerald-500"
          />

          <span>
            Tu acceso está protegido mediante
            autenticación segura.
          </span>
        </div>

        {/* ===================================================
            LEGAL
        ==================================================== */}

        <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">
          Al acceder a Credi Marketplace aceptas
          nuestras políticas de servicio y privacidad.
        </p>
      </div>
    </main>
  );
}
```
