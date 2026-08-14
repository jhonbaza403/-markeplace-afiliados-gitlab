'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

import type { UserRole } from '@/types/user';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserName: string;
  targetUserId: string;

  /**
   * Rol del usuario que será calificado.
   * Debe utilizar los mismos valores que Supabase.
   */
  targetRole: UserRole;
}

interface FormState {
  rating: number;
  comment: string;
  isFraudReport: boolean;
}

const INITIAL_FORM: FormState = {
  rating: 5,
  comment: '',
  isFraudReport: false,
};

const MIN_COMMENT_LENGTH = 5;
const MAX_COMMENT_LENGTH = 1000;

export default function RatingModal({
  isOpen,
  onClose,
  targetUserName,
  targetUserId,
  targetRole,
}: RatingModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Reinicia completamente el formulario cuando
   * el modal se cierra.
   */
  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      setLoading(false);
      setSubmitted(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  /**
   * No renderizar nada si el modal está cerrado.
   */
  if (!isOpen) {
    return null;
  }

  const updateForm = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  /**
   * Validación local.
   *
   * La seguridad definitiva debe estar igualmente
   * garantizada mediante RLS y restricciones SQL.
   */
  const validateForm = (): string | null => {
    if (
      !Number.isInteger(form.rating) ||
      form.rating < 1 ||
      form.rating > 5
    ) {
      return 'La calificación debe estar entre 1 y 5 estrellas.';
    }

    const comment = form.comment.trim();

    if (comment.length < MIN_COMMENT_LENGTH) {
      return `El comentario debe contener al menos ${MIN_COMMENT_LENGTH} caracteres.`;
    }

    if (comment.length > MAX_COMMENT_LENGTH) {
      return `El comentario no puede superar los ${MAX_COMMENT_LENGTH} caracteres.`;
    }

    if (!targetUserId) {
      return 'No se ha identificado correctamente al usuario que será calificado.';
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setErrorMessage(null);

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      /**
       * Nunca confiamos únicamente en el estado del contexto.
       * Supabase valida la sesión real.
       */
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error('No fue posible verificar la sesión.');
      }

      if (!user) {
        throw new Error(
          'Debes iniciar sesión para poder realizar una calificación.',
        );
      }

      /**
       * Impide la autocalificación.
       */
      if (user.id === targetUserId) {
        throw new Error('No puedes calificarte a ti mismo.');
      }

      /**
       * Normalización final antes de enviar a Supabase.
       */
      const payload = {
        reviewer_id: user.id,
        target_user_id: targetUserId,
        rating: form.rating,
        comment: form.comment.trim(),
        is_scam_report: form.isFraudReport,
      };

      const { error: insertError } = await supabase
        .from('ratings')
        .insert(payload);

      if (insertError) {
        /**
         * No mostramos directamente al usuario detalles
         * internos del error de Supabase.
         */
        console.error('Supabase rating error:', insertError);

        throw new Error(
          'No fue posible registrar la calificación. Verifica que la operación sea válida e inténtalo nuevamente.',
        );
      }

      setSubmitted(true);
    } catch (error: unknown) {
      console.error('Rating submission error:', error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error inesperado al registrar la calificación.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  const roleLabel: Record<UserRole, string> = {
    customer: 'cliente',
    vendor: 'vendedor',
    professional: 'profesional',
    company: 'empresa',
    admin: 'administrador',
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl">
        {/* =====================================================
            BOTÓN CERRAR
        ====================================================== */}
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          aria-label="Cerrar ventana de calificación"
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* =====================================================
            RESULTADO EXITOSO
        ====================================================== */}
        {submitted ? (
          <div className="py-8 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl"
              aria-hidden="true"
            >
              ✓
            </div>

            <h3 className="text-xl font-bold text-foreground">
              Calificación registrada
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Gracias por contribuir a la reputación y seguridad de la
              comunidad.
            </p>

            {form.isFraudReport && (
              <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                Tu reporte de seguridad fue registrado para su evaluación
                conforme a las reglas de moderación de la plataforma.
              </p>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* =================================================
                ENCABEZADO
            ================================================== */}
            <div className="mb-6 pr-8">
              <h3
                id="rating-modal-title"
                className="text-xl font-bold text-foreground"
              >
                Calificar usuario
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Estás calificando a{' '}
                <strong className="text-foreground">
                  {targetUserName}
                </strong>
                .
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Tipo de cuenta: {roleLabel[targetRole]}
              </p>
            </div>

            {/* =================================================
                ERROR
            ================================================== */}
            {errorMessage && (
              <div
                className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {/* =================================================
                ESTRELLAS
            ================================================== */}
            <fieldset className="mb-6">
              <legend className="mb-3 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Puntuación de la experiencia
              </legend>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const selected = star <= form.rating;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateForm('rating', star)}
                      disabled={loading}
                      aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                      aria-pressed={selected}
                      className={`rounded-lg p-1 text-3xl transition-transform hover:scale-110 disabled:cursor-not-allowed ${
                        selected
                          ? 'text-amber-400'
                          : 'text-muted-foreground/30'
                      }`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-center text-xs text-muted-foreground">
                {form.rating} de 5 estrellas
              </p>
            </fieldset>

            {/* =================================================
                COMENTARIO
            ================================================== */}
            <div className="mb-5">
              <label
                htmlFor="rating-comment"
                className="mb-2 block text-xs font-bold text-muted-foreground"
              >
                Comentario
              </label>

              <textarea
                id="rating-comment"
                value={form.comment}
                onChange={(event) =>
                  updateForm('comment', event.target.value)
                }
                placeholder="Describe brevemente tu experiencia..."
                rows={4}
                maxLength={MAX_COMMENT_LENGTH}
                disabled={loading}
                required
                className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-1 flex justify-end text-[11px] text-muted-foreground">
                {form.comment.length}/{MAX_COMMENT_LENGTH}
              </div>
            </div>

            {/* =================================================
                REPORTE DE SEGURIDAD
            ================================================== */}
            <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.isFraudReport}
                  onChange={(event) =>
                    updateForm('isFraudReport', event.target.checked)
                  }
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />

                <span>
                  <span className="block text-sm font-bold text-foreground">
                    Reportar posible fraude
                  </span>

                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    Utiliza esta opción únicamente cuando existan razones
                    legítimas para reportar una conducta potencialmente
                    fraudulenta.
                  </span>
                </span>
              </label>
            </div>

            {/* =================================================
                ACCIONES
            ================================================== */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity ${
                  form.isFraudReport
                    ? 'bg-destructive hover:opacity-90'
                    : 'bg-primary hover:opacity-90'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {loading
                  ? 'Registrando...'
                  : form.isFraudReport
                    ? 'Enviar reporte'
                    : 'Guardar calificación'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}