'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicServiceCard from './PublicServiceCard';
import BottomSheet from './BottomSheet';
import { PublicServiceEntry } from '@/lib/types';
import { Play, Volume2, VolumeX, ChevronUp, ChevronDown, DollarSign } from 'lucide-react';
import { ProfileProgressionSquare } from '@/components/progression/ProgressionSquareBadge';

interface VideoFeedProps {
  services: PublicServiceEntry[];
  onViewStrategy: (service: PublicServiceEntry) => void;
  onViewProfile?: (profileId: string) => void;
  /** Pausar y silenciar el videofeed (evita solape de audio con el overlay de detalle). */
  suppressBackgroundPlayback?: boolean;
  /** Identidad del set de resultados actual (query + filtros que lo produjeron). Al cambiar,
   *  reinicia el scroll a la posición 0. */
  resultsKey?: string;
}

const SCROLL_DEBOUNCE_MS = 320;
/** Solo se muestra la primera vez que alguien entra al directorio en este navegador. */
const SWIPE_HINT_STORAGE_KEY = 'seeket_directorio_swipe_hint_seen_v1';
const SWIPE_HINT_DURATION_MS = 3200;

export default function VideoFeed({
  services,
  onViewStrategy,
  onViewProfile,
  suppressBackgroundPlayback = false,
  resultsKey,
}: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [videoMuted, setVideoMuted] = useState(true);
  const [mobileCardOpen, setMobileCardOpen] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const mutedSnapshotRef = useRef(true);
  const indexRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  indexRef.current = currentIndex;

  useEffect(() => {
    setCurrentIndex(0);
    indexRef.current = 0;
  }, [resultsKey]);

  const currentService = services[currentIndex];

  // Hint "deslizá arriba/abajo" — una sola vez por navegador, y solo si hay más de un
  // perfil para navegar. El estilo de barra de progreso arriba recuerda a Stories
  // (swipe horizontal), pero acá el gesto real es vertical: vale la pena aclararlo,
  // sin que estorbe después de la primera vez.
  useEffect(() => {
    if (typeof window === 'undefined' || services.length <= 1) return;
    try {
      if (!window.localStorage.getItem(SWIPE_HINT_STORAGE_KEY)) {
        setShowSwipeHint(true);
      }
    } catch {
      /* localStorage no disponible (ej. modo privado) — simplemente no mostramos el hint */
    }
  }, [services.length]);

  const dismissSwipeHint = useCallback(() => {
    setShowSwipeHint((wasShown) => {
      if (wasShown) {
        try {
          window.localStorage.setItem(SWIPE_HINT_STORAGE_KEY, '1');
        } catch {
          /* noop */
        }
      }
      return false;
    });
  }, []);

  useEffect(() => {
    if (!showSwipeHint) return;
    const t = setTimeout(dismissSwipeHint, SWIPE_HINT_DURATION_MS);
    return () => clearTimeout(t);
  }, [showSwipeHint, dismissSwipeHint]);

  // Al cambiar de tarjeta, colapsamos la ficha mobile de vuelta a su estado "peek".
  useEffect(() => {
    setMobileCardOpen(false);
  }, [currentIndex]);

  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v) return;
    if (suppressBackgroundPlayback) {
      mutedSnapshotRef.current = videoMuted;
      void v.pause();
      v.muted = true;
      setVideoMuted(true);
    } else {
      setVideoMuted(mutedSnapshotRef.current);
      void v.play().catch(() => {
        /* ignore autoplay tras cerrar overlay */
      });
    }
  }, [suppressBackgroundPlayback]);

  useEffect(() => {
    if (services.length > 0 && currentIndex >= services.length) {
      setCurrentIndex(Math.max(0, services.length - 1));
    }
  }, [services.length, currentIndex]);

  const goNext = useCallback(() => {
    if (indexRef.current < services.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
      lastScrollTimeRef.current = Date.now();
    }
  }, [services.length]);

  const goPrev = useCallback(() => {
    if (indexRef.current > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
      lastScrollTimeRef.current = Date.now();
    }
  }, []);

  const handleViewStrategy = useCallback(() => {
    if (currentService) onViewStrategy(currentService);
  }, [currentService, onViewStrategy]);

  const handleViewProfile = useCallback(() => {
    if (currentService?.profile_id) onViewProfile?.(currentService.profile_id);
  }, [currentService, onViewProfile]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // No interceptar flechas si el foco está en un input/textarea (ej. buscador, filtros).
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (mobileCardOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, mobileCardOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let touchHandled = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      dismissSwipeHint();
      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_DEBOUNCE_MS) return;

      const i = indexRef.current;
      if (e.deltaY > 0 && i < services.length - 1) {
        goNext();
      } else if (e.deltaY < 0 && i > 0) {
        goPrev();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      touchHandled = false;
      dismissSwipeHint();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchHandled) return;
      // No interceptar el gesto si el sheet de la ficha está abierto (su propio scroll manda).
      if (mobileCardOpen) return;
      e.preventDefault();

      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;
      const i = indexRef.current;

      if (Math.abs(diff) > 50) {
        touchHandled = true;
        if (diff > 0 && i < services.length - 1) {
          goNext();
        } else if (diff < 0 && i > 0) {
          goPrev();
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [services.length, goNext, goPrev, mobileCardOpen, dismissSwipeHint]);

  if (!currentService) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/50">No hay proveedores que coincidan</p>
      </div>
    );
  }

  const slideVariants = {
    next: {
      initial: { opacity: 0, y: 80, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -80, scale: 0.98 },
    },
    prev: {
      initial: { opacity: 0, y: -80, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 80, scale: 0.98 },
    },
  };

  const v = direction === 1 ? slideVariants.next : slideVariants.prev;
  const spring = { type: 'spring' as const, stiffness: 400, damping: 32 };

  const precioFormatted =
    currentService.precio_inicial_num != null
      ? new Intl.NumberFormat('es-MX').format(currentService.precio_inicial_num) + ' USD'
      : null;

  const videoContent = currentService.video_portfolio ? (
    <>
      <video
        ref={bgVideoRef}
        src={currentService.video_portfolio}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted={videoMuted}
        playsInline
      />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setVideoMuted(m => !m); }}
        aria-label={videoMuted ? 'Activar sonido' : 'Silenciar'}
        className="focus-ring absolute bottom-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-colors"
      >
        {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </>
  ) : (
    <div className="video-simulate w-full h-full relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="relative z-10 text-center px-4">
        <p className="text-xl font-bold mb-2 drop-shadow-lg">{currentService.display_name ?? 'Proveedor'}</p>
        <p className="text-seeket-orange text-sm font-medium drop-shadow">{currentService.macro_category_name ?? ''}</p>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
        <Play className="w-4 h-4 fill-white text-white" />
        <span className="text-xs font-medium text-white/90">Simulación</span>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 relative flex items-center justify-center lg:py-4 lg:px-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={spring}
            className="absolute inset-0"
          >
            {/* ---------- DESKTOP (lg+): video + ficha lado a lado, sin cambios de fondo ---------- */}
            <div className="hidden h-full items-center justify-center gap-4 px-3 py-4 lg:flex">
              <div className="h-full max-h-full aspect-[9/16] flex-shrink-0 rounded-2xl overflow-hidden ring-2 ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.15)] bg-black/40 relative">
                {videoContent}
              </div>
              <div className="flex h-full max-h-full min-h-0 aspect-[9/16] flex-shrink-0 flex-col">
                <PublicServiceCard
                  service={currentService}
                  onOpen={handleViewStrategy}
                  onOpenProfile={handleViewProfile}
                />
              </div>
            </div>

            {/* ---------- MOBILE (<lg): feed a pantalla completa + ficha como peek bar ----------
                En 768px (md) el feed se enmarca centrado, como vista de dispositivo, en vez de
                estirar el mismo full-bleed de teléfono al ancho de una tablet. */}
            <div className="relative flex h-full w-full flex-col lg:hidden">
              <div className="relative mx-auto min-h-0 w-full flex-1 overflow-hidden bg-black/40 md:my-2 md:max-w-[430px] md:rounded-[28px] md:ring-1 md:ring-white/15 md:shadow-2xl md:shadow-black/60">
                {videoContent}

                {/* Hint "deslizá arriba/abajo" — una sola vez, no bloquea toques, se auto-oculta */}
                {showSwipeHint && (
                  <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-center">
                    <div className="animate-hint-fade flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3.5 py-2 text-xs font-medium text-white/90 backdrop-blur-md">
                      <ChevronUp className="h-3.5 w-3.5 animate-bounce" />
                      <span>Deslizá arriba o abajo</span>
                      <ChevronDown className="h-3.5 w-3.5 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    </div>
                  </div>
                )}

                {/* Barra de progreso tipo "stories" — reemplaza los dots en mobile */}
                <div className="absolute inset-x-0 top-0 z-10 flex gap-1 px-3 pt-3">
                  {services.map((_, index) => (
                    <div key={index} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-seeket-orange to-seeket-red-vibrant transition-all duration-300 ${
                          index < currentIndex ? 'w-full' : index === currentIndex ? 'w-full' : 'w-0'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                {/* Peek bar: resumen de la ficha, tocable para expandir */}
                <button
                  type="button"
                  onClick={() => { dismissSwipeHint(); setMobileCardOpen(true); }}
                  className="focus-ring absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 border-t border-white/10 bg-gradient-to-t from-black/85 via-black/70 to-transparent px-4 pb-5 pt-8 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 truncate text-sm font-bold text-white">
                      {currentService.display_name ?? 'Proveedor'}
                      <ProfileProgressionSquare tierLevel={currentService.tier_level} compact />
                    </p>
                    <p className="mt-0.5 truncate text-xs text-white/70">{currentService.service_title}</p>
                  </div>
                  {precioFormatted && (
                    <div className="flex shrink-0 items-center gap-1 nums">
                      <DollarSign className="h-3.5 w-3.5 text-seeket-orange" />
                      <span className="text-sm font-bold text-white">{precioFormatted}</span>
                    </div>
                  )}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80">
                    <ChevronUp className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicador de scroll — solo desktop, en mobile lo reemplaza la barra de progreso superior */}
      <div className="hidden flex-shrink-0 py-4 lg:flex justify-center">
        <div className="flex items-center gap-2">
          {services.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-seeket-red-vibrant' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Ficha completa como bottom sheet en mobile */}
      <BottomSheet
        open={mobileCardOpen}
        onClose={() => setMobileCardOpen(false)}
        title={currentService.display_name ?? 'Perfil'}
      >
        <div className="px-4 pb-6 pt-3">
          <PublicServiceCard
            service={currentService}
            onOpen={handleViewStrategy}
            onOpenProfile={handleViewProfile}
          />
        </div>
      </BottomSheet>
    </div>
  );
}