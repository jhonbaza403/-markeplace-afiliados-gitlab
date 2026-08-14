'use client';

// ==========================================================
// ARCHIVO: src/components/ShareModal.tsx
// Credi Marketplace
//
// Modal profesional para compartir contenido.
//
// Características:
// - Web Share API
// - WhatsApp
// - Telegram
// - Facebook
// - X
// - Copiar enlace
// - Accesibilidad ARIA
// - Cierre mediante Escape
// - Cierre mediante backdrop
// - Protección contra errores de Clipboard API
// - Compatible con SSR / Next.js
//
// IMPORTANTE:
// Este componente NO gestiona autenticación, Supabase ni
// analítica. Es exclusivamente responsable de la interfaz
// y las acciones de compartir.
// ==========================================================

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

// ==========================================================
// TIPOS
// ==========================================================

export interface ShareModalProps {
  /** Indica si el modal está visible */
  isOpen: boolean;

  /** Función para cerrar el modal */
  onClose: () => void;

  /** URL que será compartida */
  url: string;

  /** Título del contenido compartido */
  title: string;
}

// ==========================================================
// COMPONENTE
// ==========================================================

export default function ShareModal({
  isOpen,
  onClose,
  url,
  title,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const [copyError, setCopyError] = useState(false);

  // ========================================================
  // DETECTAR WEB SHARE API
  // ========================================================

  useEffect(() => {
    if (
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function'
    ) {
      setHasNativeShare(true);
    }
  }, []);

  // ========================================================
  // CONTROL DEL TECLADO
  // ========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // ========================================================
  // RESET DEL ESTADO AL CERRAR
  // ========================================================

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setCopyError(false);
    }
  }, [isOpen]);

  // ========================================================
  // DATOS CODIFICADOS
  // ========================================================

  const encodedUrl = useMemo(
    () => encodeURIComponent(url),
    [url]
  );

  const encodedTitle = useMemo(
    () => encodeURIComponent(title),
    [title]
  );

  // ========================================================
  // ENLACES DE REDES SOCIALES
  // ========================================================

  const shareLinks = useMemo(
    () => [
      {
        name: 'WhatsApp',
        icon: 'fa-whatsapp',
        color:
          'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500',
        href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      },
      {
        name: 'Telegram',
        icon: 'fa-telegram',
        color:
          'bg-sky-500 hover:bg-sky-600 focus-visible:ring-sky-500',
        href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      },
      {
        name: 'Facebook',
        icon: 'fa-facebook',
        color:
          'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      },
      {
        name: 'X',
        icon: 'fa-x-twitter',
        color:
          'bg-slate-900 hover:bg-black focus-visible:ring-slate-500 dark:bg-slate-800',
        href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      },
    ],
    [encodedUrl, encodedTitle]
  );

  // ========================================================
  // WEB SHARE API
  // ========================================================

  const handleNativeShare = useCallback(async () => {
    if (
      typeof navigator === 'undefined' ||
      typeof navigator.share !== 'function'
    ) {
      return;
    }

    try {
      await navigator.share({
        title,
        text: 'Descubre este contenido en Credi Marketplace.',
        url,
      });

      onClose();
    } catch (error) {
      // AbortError significa que el usuario canceló
      // voluntariamente el diálogo nativo.
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      console.error(
        'Error al utilizar la función nativa de compartir:',
        error
      );
    }
  }, [onClose, title, url]);

  // ========================================================
  // COPIAR ENLACE
  // ========================================================

  const handleCopyLink = useCallback(async () => {
    if (!url) {
      return;
    }

    setCopyError(false);

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(url);

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);

        return;
      }

      // Fallback para navegadores sin Clipboard API.
      const textarea = document.createElement('textarea');

      textarea.value = url;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';

      document.body.appendChild(textarea);

      textarea.select();

      const successful = document.execCommand('copy');

      document.body.removeChild(textarea);

      if (!successful) {
        throw new Error('No fue posible copiar el enlace.');
      }

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error al copiar el enlace:', error);
      setCopyError(true);
    }
  }, [url]);

  // ========================================================
  // NO RENDERIZAR SI ESTÁ CERRADO
  // ========================================================

  if (!isOpen) {
    return null;
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        aria-describedby="share-modal-description"
        className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl"
      >
        {/* ==================================================
            BOTÓN CERRAR
        ================================================== */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar ventana de compartir"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

        {/* ==================================================
            CABECERA
        ================================================== */}

        <div className="pr-8">
          <h2
            id="share-modal-title"
            className="text-xl font-bold text-foreground"
          >
            Compartir contenido
          </h2>

          <p
            id="share-modal-description"
            className="mt-2 line-clamp-3 text-sm text-muted-foreground"
          >
            {title}
          </p>
        </div>

        {/* ==================================================
            WEB SHARE API
        ================================================== */}

        {hasNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <i
              className="fa-solid fa-share-nodes"
              aria-hidden="true"
            />

            <span>
              Compartir con mis aplicaciones
            </span>
          </button>
        )}

        {/* ==================================================
            REDES SOCIALES
        ================================================== */}

        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Compartir directamente
          </p>

          <div className="grid grid-cols-4 gap-3">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Compartir en ${link.name}`}
                title={`Compartir en ${link.name}`}
                className={`flex aspect-square items-center justify-center rounded-xl text-white shadow-sm transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${link.color}`}
              >
                <i
                  className={`fa-brands ${link.icon} text-2xl`}
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>

        {/* ==================================================
            COPIAR ENLACE
        ================================================== */}

        <div className="mt-6">
          <label
            htmlFor="share-url"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Enlace para compartir
          </label>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-muted p-1">
            <input
              id="share-url"
              type="text"
              readOnly
              value={url}
              aria-label="Enlace para compartir"
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-muted-foreground outline-none"
            />

            <button
              type="button"
              onClick={handleCopyLink}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              }`}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          {/* =================================================
              MENSAJES DE ESTADO
          ================================================= */}

          {copied && (
            <p
              className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              role="status"
              aria-live="polite"
            >
              El enlace se copió correctamente.
            </p>
          )}

          {copyError && (
            <p
              className="mt-2 text-xs font-medium text-destructive"
              role="alert"
            >
              No fue posible copiar automáticamente el enlace. Puedes
              seleccionarlo y copiarlo manualmente.
            </p>
          )}
        </div>

        {/* ==================================================
            PIE
        ================================================== */}

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-center text-[11px] text-muted-foreground">
            Comparte contenido de forma rápida y segura desde
            Credi Marketplace.
          </p>
        </div>
      </div>
    </div>
  );
}