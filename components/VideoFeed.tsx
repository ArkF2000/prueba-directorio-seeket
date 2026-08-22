'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicServiceCard from './PublicServiceCard';
import { PublicServiceEntry } from '@/lib/types';
import { Play, Volume2, VolumeX } from 'lucide-react';

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
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let touchHandled = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
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
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchHandled) return;
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
  }, [services.length, goNext, goPrev]);

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col overflow-hidden"
    >
      <div className="flex-1 min-h-0 relative flex items-center justify-center py-4 px-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={spring}
            className="absolute inset-0 flex items-center justify-center gap-4 px-3 py-4"
          >
            {/* Video 9:16 (izquierda) — contorno y simulación */}
            <div className="h-full max-h-full aspect-[9/16] flex-shrink-0 rounded-2xl overflow-hidden ring-2 ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.15)] bg-black/40 relative">
              {currentService.video_portfolio ? (
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
                    className="absolute bottom-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-colors"
                  >
                    {videoMuted
                      ? <VolumeX className="w-4 h-4" />
                      : <Volume2 className="w-4 h-4" />
                    }
                  </button>
                </>
              ) : (
                <div className="video-simulate w-full h-full relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="relative z-10 text-center px-4">
                    <p className="text-xl font-bold mb-2 drop-shadow-lg">{currentService.display_name ?? 'Proveedor'}</p>
                    <p className="text-seeket-orange text-sm font-medium drop-shadow">{currentService.macro_category_name ?? ''}</p>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <Play className="w-4 h-4 fill-white text-white" />
                    <span className="text-xs font-medium text-white/90">Simulación</span>
                  </div>
                </div>
              )}
            </div>

            {/* Columna ficha 9:16 (derecha) — dos burbujas apiladas, mismo ancho que el video */}
            <div className="flex h-full max-h-full min-h-0 aspect-[9/16] flex-shrink-0 flex-col">
              <PublicServiceCard
                service={currentService}
                onOpen={handleViewStrategy}
                onOpenProfile={handleViewProfile}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicador de scroll */}
      <div className="flex-shrink-0 py-4 flex justify-center">
        <div className="flex items-center gap-2">
          {services.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-seeket-red-vibrant'
                  : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
