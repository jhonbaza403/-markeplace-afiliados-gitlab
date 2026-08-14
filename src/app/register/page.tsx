```tsx
'use client';

// ==========================================================
// ARCHIVO: src/app/register/page.tsx
// Credi Marketplace
//
// Página de registro de usuarios.
//
// RESPONSABILIDADES:
// - Registrar nuevos usuarios.
// - Validar datos básicos del formulario.
// - Mostrar estados de carga y errores.
// - Mantener una experiencia premium y responsive.
// - Delegar la autenticación a authService.
//
// REGLA ARQUITECTÓNICA:
// Esta página NO consulta Supabase directamente.
// La autenticación se realiza mediante signUpUser().
// ==========================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useState,
  type FormEvent,
} from 'react';

import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';

import { signUpUser } from '@/features/auth/services/authService';

// ==========================================================
// CONSTANTES
// ==========================================================

const MIN_PASSWORD_LENGTH = 8;

// ==========================================================
// COMPONENTE
// ==========================================================

export default function RegisterPage() {
  const router = useRouter();

  // ========================================================
  // ESTADO
  // ========================================================

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // ========================================================
  // REGISTRO
  // ========================================================

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      setError('');
      setSuccess('');

      const normalizedName =
        fullName.trim();

      const normalizedEmail =
        email.trim().toLowerCase();

      // ------------------------------------------------------
      // VALIDACIÓN DEL NOMBRE
      // ------------------------------------------------------

      if (normalizedName.length < 2) {
        setError(
          'Introduce tu nombre completo.'
        );
        return;
      }

      // ------------------------------------------------------
      // VALIDACIÓN DEL CORREO
      // ------------------------------------------------------

      if (!normalizedEmail) {
        setError(
          'Introduce un correo electrónico válido.'
        );
        return;
      }

      // ------------------------------------------------------
      // VALIDACIÓN DE CONTRASEÑA
      // ------------------------------------------------------

      if (
        password.length <
        MIN_PASSWORD_LENGTH
      ) {
        setError(
          `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
        );
        return;
      }

      try {
        setIsSubmitting(true);

        await signUpUser(
          normalizedEmail,
          password,
          normalizedName
        );

        setSuccess(
          'Tu cuenta fue creada correctamente.'
        );

        /*
         * El servicio de autenticación determina
         * si la sesión queda activa inmediatamente
         * o requiere confirmación del correo.
         *
         * Mantenemos el flujo centralizado en authService.
         */

        router.push('/dashboard');
      } catch (err: unknown) {
        console.error(
          '[RegisterPage] Error registrando usuario:',
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : 'No fue posible crear la cuenta. Inténtalo nuevamente.';

        setError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      email,
      fullName,
      isSubmitting,
      password,
      router,
    ]
  );

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[var(--background)]
        px-4
        py-10
        text-[var(--foreground)]
        sm:px-6
        lg:py-16
      "
    >
      {/* ==================================================
          FONDO DECORATIVO
      ================================================== */}

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
            -left-40
            -top-40
            size-[28rem]
            rounded-full
            bg-[var(--primary)]/8
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-40
            size-[28rem]
            rounded-full
            bg-cyan-500/8
            blur-3xl
          "
        />
      </div>

      {/* ==================================================
          CONTENEDOR
      ================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >
        {/* =================================================
            MARCA
        ================================================= */}

        <div className="mb-8 text-center">
          <Link
            href="/"
            className="
              inline-flex
              items-center
              rounded-xl
              px-2
              py-1
              text-2xl
              font-black
              tracking-tight
              text-[var(--foreground)]
              transition-opacity
              hover:opacity-90
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--primary)]
              focus-visible:ring-offset-2
            "
          >
            Credi{' '}
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

          <p
            className="
              mt-3
              text-sm
              text-[var(--muted)]
            "
          >
            Crea tu cuenta y comienza a formar
            parte del marketplace.
          </p>
        </div>

        {/* =================================================
            TARJETA
        ================================================= */}

        <section
          className="
            rounded-3xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-1
            shadow-[0_24px_80px_rgba(0,0,0,0.08)]
          "
        >
          <div
            className="
              rounded-[1.35rem]
              border
              border-[var(--border)]/60
              bg-[var(--background)]
              p-6
              sm:p-8
            "
          >
            {/* =================================================
                CABECERA
            ================================================= */}

            <div className="mb-7">
              <div
                className="
                  mb-4
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--primary)]/10
                  text-[var(--primary)]
                "
              >
                <UserPlus
                  aria-hidden="true"
                  className="size-6"
                />
              </div>

              <h1
                className="
                  text-2xl
                  font-black
                  tracking-tight
                  text-[var(--foreground)]
                  sm:text-3xl
                "
              >
                Crear una cuenta
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-[var(--muted)]
                "
              >
                Regístrate para comprar, vender,
                ofrecer servicios y participar en
                Credi Marketplace.
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                role="alert"
                className="
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  p-4
                  text-sm
                  text-red-700
                  dark:text-red-300
                "
              >
                <AlertCircle
                  aria-hidden="true"
                  className="
                    mt-0.5
                    size-5
                    shrink-0
                  "
                />

                <p>{error}</p>
              </div>
            )}

            {/* =================================================
                ÉXITO
            ================================================= */}

            {success && (
              <div
                role="status"
                className="
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  p-4
                  text-sm
                  text-emerald-700
                  dark:text-emerald-300
                "
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="
                    mt-0.5
                    size-5
                    shrink-0
                  "
                />

                <p>{success}</p>
              </div>
            )}

            {/* =================================================
                FORMULARIO
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >
              {/* =================================================
                  NOMBRE
              ================================================= */}

              <div>
                <label
                  htmlFor="full-name"
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                  "
                >
                  Nombre completo
                </label>

                <div className="relative">
                  <User
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      size-5
                      -translate-y-1/2
                      text-[var(--muted)]
                    "
                  />

                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(event) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    placeholder="Tu nombre completo"
                    disabled={isSubmitting}
                    className="
                      min-h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      pl-11
                      pr-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      transition-all
                      placeholder:text-[var(--muted-light)]
                      focus:border-[var(--primary)]
                      focus:ring-4
                      focus:ring-[var(--primary)]/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>
                <label
                  htmlFor="register-email"
                  className="
                    mb-2
                    block
                    text-sm
                    font-bold
                    text-[var(--foreground)]
                  "
                >
                  Correo electrónico
                </label>

                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      size-5
                      -translate-y-1/2
                      text-[var(--muted)]
                    "
                  />

                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                    className="
                      min-h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      pl-11
                      pr-4
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      transition-all
                      placeholder:text-[var(--muted-light)]
                      focus:border-[var(--primary)]
                      focus:ring-4
                      focus:ring-[var(--primary)]/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  CONTRASEÑA
              ================================================= */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="register-password"
                    className="
                      text-sm
                      font-bold
                      text-[var(--foreground)]
                    "
                  >
                    Contraseña
                  </label>

                  <span
                    className="
                      text-xs
                      font-medium
                      text-[var(--muted)]
                    "
                  >
                    Mín. {MIN_PASSWORD_LENGTH} caracteres
                  </span>
                </div>

                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-3.5
                      top-1/2
                      size-5
                      -translate-y-1/2
                      text-[var(--muted)]
                    "
                  />

                  <input
                    id="register-password"
                    name="password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="new-password"
                    minLength={
                      MIN_PASSWORD_LENGTH
                    }
                    required
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Crea una contraseña segura"
                    disabled={isSubmitting}
                    className="
                      min-h-12
                      w-full
                      rounded-xl
                      border
                      border-[var(--border)]
                      bg-[var(--surface)]
                      pl-11
                      pr-12
                      text-sm
                      text-[var(--foreground)]
                      outline-none
                      transition-all
                      placeholder:text-[var(--muted-light)]
                      focus:border-[var(--primary)]
                      focus:ring-4
                      focus:ring-[var(--primary)]/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    disabled={isSubmitting}
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
                      text-[var(--muted)]
                      transition-colors
                      hover:bg-[var(--surface-secondary)]
                      hover:text-[var(--foreground)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--primary)]
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

              {/* =================================================
                  SEGURIDAD
              ================================================= */}

              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  bg-[var(--surface-secondary)]
                  p-4
                "
              >
                <ShieldCheck
                  aria-hidden="true"
                  className="
                    mt-0.5
                    size-5
                    shrink-0
                    text-[var(--primary)]
                  "
                />

                <p
                  className="
                    text-xs
                    leading-5
                    text-[var(--muted)]
                  "
                >
                  Utiliza una contraseña única y
                  segura. Tus credenciales son
                  gestionadas mediante el sistema
                  de autenticación de la plataforma.
                </p>
              </div>

              {/* =================================================
                  BOTÓN
              ================================================= */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--primary)]
                  px-5
                  py-3
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-blue-900/10
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--primary-hover)]
                  hover:shadow-xl
                  focus-visible:outline-none
                  focus-visible:ring-4
                  focus-visible:ring-[var(--primary)]/20
                  disabled:cursor-not-allowed
                  disabled:translate-y-0
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="
                        size-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <UserPlus
                      aria-hidden="true"
                      className="size-4"
                    />

                    Crear cuenta
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                LOGIN
            ================================================= */}

            <div
              className="
                mt-7
                border-t
                border-[var(--border)]
                pt-6
                text-center
              "
            >
              <p
                className="
                  text-sm
                  text-[var(--muted)]
                "
              >
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href="/auth/login"
                  className="
                    font-bold
                    text-[var(--primary)]
                    underline-offset-4
                    hover:underline
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--primary)]
                  "
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            AVISO
        ================================================= */}

        <p
          className="
            mx-auto
            mt-6
            max-w-sm
            text-center
            text-[11px]
            leading-5
            text-[var(--muted)]
          "
        >
          Al crear una cuenta aceptas las condiciones
          de uso y las políticas aplicables de Credi
          Marketplace.
        </p>
      </div>
    </main>
  );
}
```
