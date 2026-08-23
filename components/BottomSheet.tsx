'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Contenido fijo debajo del scroll (ej. botón "Ver resultados"). */
  footer?: ReactNode;
}

const TRANSITION_MS = 260;

/**
 * Bottom sheet compartido (mobile). Reemplaza, en pantallas chicas, lo que en
 * desktop son paneles fijos lado a lado (filtros / ficha de perfil). Es el mismo
 * patrón mental que ya usa cualquier app de feed vertical (Instagram, TikTok):
 * el contenido secundario vive "a un gesto de distancia", no compite por espacio
 * con el feed principal.
 *
 * Entrada y salida son simétricas: el panel se mantiene montado un instante extra
 * al cerrar para poder animar hacia abajo, en vez de desaparecer de golpe.
 * En md+ (tablet) se centra con un ancho máximo, en vez de estirarse borde a borde.
 */
export default function BottomSheet({ open, onClose, title, children, footer }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Doble rAF: asegura que el navegador pinte el estado "cerrado" antes de
      // animar hacia "abierto" (si no, la transición nunca se dispara).
      const raf1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(raf1);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, onClose]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] lg:hidden">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        style={{ transition: `opacity ${TRANSITION_MS}ms ease` }}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${visible ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
        className="absolute inset-x-0 bottom-0 flex max-h-[82vh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-white/12 bg-[#111114]/98 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:inset-x-auto md:left-1/2 md:right-auto md:max-w-lg md:-translate-x-1/2"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/8 px-4 pt-3 pb-3">
          <div className="mx-auto absolute left-1/2 top-1.5 h-1 w-9 -translate-x-1/2 rounded-full bg-white/20" />
          <h2 className="text-sm font-bold text-white/90">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="focus-ring flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
        {footer && (
          <div className="pb-safe shrink-0 border-t border-white/8 bg-[#111114]/98 px-4 pt-3 pb-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}