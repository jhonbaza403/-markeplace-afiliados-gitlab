'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ShareModal from './ShareModal';

/* ==========================================================
   TIPOS
========================================================== */

interface ShortVideo {
  id: string;
  title: string;
  creator: string;
  videoUrl: string;
  posterUrl?: string;
  likes: number;
  productLink: string;
  isExternalProduct?: boolean;
}

/* ==========================================================
   DATOS DEMOSTRATIVOS
========================================================== */

/**
 * Estos datos son únicamente de demostración.
 *
 * En producción deberán proceder de Supabase mediante
 * un servicio/repositorio de Shorts.
 */
const DEMO_VIDEOS: readonly ShortVideo[] = [
  {
    id: 'affiliate-system',
    title:
      'Aprende a vender más con nuestro sistema de afiliados',
    creator: 'Marketing Fácil',
    videoUrl:
      'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 1250,
    productLink: '/dashboard/affiliate',
  },
  {
    id: 'scientific-magazine',
    title:
      'Nueva revista científica internacional disponible',
    creator: 'Editorial Académica',
    videoUrl:
      'https://www.w3schools.com/html/mov_bbb.mp4',
    likes: 430,
    productLink: '/magazines',
  },
];

/* ==========================================================
   COMPONENTE
========================================================== */

export default function ShortsFeed() {
  const { user } = useAuth();

  const [likedVideos, setLikedVideos] = useState<Set<string>>(
    () => new Set()
  );

  const [isShareModalOpen, setIsShareModalOpen] =
    useState(false);

  const [currentShare, setCurrentShare] = useState<{
    title: string;
    url: string;
  }>({
    title: '',
    url: '',
  });

  /*
   * useMemo evita recrear innecesariamente la referencia
   * mientras posteriormente sustituimos estos datos por
   * información procedente del backend.
   */
  const videos = useMemo(
    () => DEMO_VIDEOS,
    []
  );

  /* ========================================================
     LIKE
  ======================================================== */

  const handleLike = (videoId: string) => {
    setLikedVideos((previous) => {
      const next = new Set(previous);

      if (next.has(videoId)) {
        next.delete(videoId);
      } else {
        next.add(videoId);
      }

      return next;
    });

    /*
     * TODO producción:
     *
     * Registrar el evento mediante:
     *
     * shortsService.toggleLike(videoId)
     *
     * No debemos considerar este estado local como
     * persistencia definitiva.
     */
  };

  /* ========================================================
     COMPARTIR
  ======================================================== */

  const handleShareClick = (
    title: string,
    videoId: string
  ) => {
    /*
     * Nunca utilizamos el UUID de auth.users como identificador
     * público de afiliación.
     *
     * La versión productiva deberá utilizar algo como:
     *
     * user.referralCode
     *
     * o:
     *
     * profile.referral_code
     */

    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : '';

    const referralCode =
      user?.user_metadata?.referral_code;

    const query =
      referralCode
        ? `?ref=${encodeURIComponent(referralCode)}`
        : '';

    const shareUrl =
      `${baseUrl}/video/${encodeURIComponent(videoId)}${query}`;

    setCurrentShare({
      title,
      url: shareUrl,
    });

    setIsShareModalOpen(true);
  };

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <section
      className="relative mx-auto w-full max-w-md px-4 py-8"
      aria-labelledby="shorts-feed-title"
    >
      {/* ====================================================
          CABECERA
      ===================================================== */}

      <header className="mb-6 text-center">
        <h2
          id="shorts-feed-title"
          className="text-2xl font-bold text-foreground"
        >
          Publicidad y Shorts
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Descubre productos, servicios y oportunidades
          comerciales en formato corto.
        </p>
      </header>

      {/* ====================================================
          FEED
      ===================================================== */}

      <div className="space-y-8">
        {videos.map((video) => {
          const isLiked = likedVideos.has(video.id);

          const displayedLikes =
            video.likes + (isLiked ? 1 : 0);

          return (
            <article
              key={video.id}
              className="group relative flex h-[550px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-black shadow-2xl"
              aria-label={`Video: ${video.title}`}
            >
              {/* =================================================
                  VIDEO
              ================================================== */}

              <video
                src={video.videoUrl}
                poster={video.posterUrl}
                controls
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
                aria-label={video.title}
              >
                Tu navegador no soporta la reproducción de
                vídeos HTML5.
              </video>

              {/* =================================================
                  GRADIENTE INFERIOR
              ================================================== */}

              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                aria-hidden="true"
              />

              {/* =================================================
                  INFORMACIÓN DEL VIDEO
              ================================================== */}

              <div className="absolute bottom-16 left-4 right-20 text-white drop-shadow-md">
                <h3 className="mb-1 text-lg font-bold leading-tight">
                  {video.title}
                </h3>

                <p className="mb-3 text-sm font-medium text-gray-300">
                  @{video.creator}
                </p>

                <div className="pointer-events-auto">
                  {video.isExternalProduct ? (
                    <a
                      href={video.productLink}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Ver oferta
                    </a>
                  ) : (
                    <Link
                      href={video.productLink}
                      className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Ver oferta
                    </Link>
                  )}
                </div>
              </div>

              {/* =================================================
                  ACCIONES
              ================================================== */}

              <div className="absolute bottom-16 right-4 flex flex-col items-center gap-6 text-white drop-shadow-md">
                {/* LIKE */}

                <button
                  type="button"
                  onClick={() => handleLike(video.id)}
                  aria-label={
                    isLiked
                      ? `Quitar me gusta de ${video.title}`
                      : `Me gusta en ${video.title}`
                  }
                  aria-pressed={isLiked}
                  className="flex flex-col items-center transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                  <span
                    className={`rounded-full bg-black/50 p-3 backdrop-blur-md transition-colors ${
                      isLiked
                        ? 'text-red-500'
                        : 'text-white'
                    }`}
                  >
                    <svg
                      className="h-7 w-7"
                      fill={
                        isLiked
                          ? 'currentColor'
                          : 'none'
                      }
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </span>

                  <span className="mt-1 text-xs font-bold">
                    {displayedLikes.toLocaleString()}
                  </span>
                </button>

                {/* COMPARTIR */}

                <button
                  type="button"
                  onClick={() =>
                    handleShareClick(
                      video.title,
                      video.id
                    )
                  }
                  aria-label={`Compartir ${video.title}`}
                  className="flex flex-col items-center transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                >
                  <span className="rounded-full bg-black/50 p-3 backdrop-blur-md">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </span>

                  <span className="mt-1 text-xs font-bold">
                    Compartir
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ====================================================
          SHARE MODAL
      ===================================================== */}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={currentShare.url}
        title={currentShare.title}
      />
    </section>
  );
}