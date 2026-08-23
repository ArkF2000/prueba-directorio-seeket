'use client';

import { Briefcase, LayoutGrid, User } from 'lucide-react';
import SeeketLogo from '@/components/SeeketLogo';

/**
 * Mock estático del header real de SEEKET. Sin auth, sin datos: solo la fachada visual
 * que enmarca la pantalla del directorio para este reto.
 *
 * v2: paleta alineada al nuevo fondo negro real, borde inferior con leve glow de marca
 * en vez de un simple hairline, y espaciado ajustado para 375px (el label "Directorio"
 * se colapsa antes que en la v1 para no apretar el logo).
 */
export default function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-[100] w-full border-b border-white/[0.07]"
      style={{
        background: 'rgba(10, 10, 12, 0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 1px 0 0 rgba(250, 57, 52, 0.12)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <SeeketLogo size="sm" animated={false} className="text-lg sm:text-xl" />
        </div>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Principal">
          <span className="flex items-center gap-2 rounded-lg bg-white/[0.08] px-2.5 py-2 text-sm font-medium text-white sm:px-4">
            <LayoutGrid className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">Directorio</span>
          </span>

          <span className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 xs:flex sm:px-4">
            <Briefcase className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">Tus servicios</span>
          </span>

          <div className="relative ml-1 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-2 py-1.5 text-sm font-medium text-white sm:ml-3 sm:px-3 sm:py-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-seeket-orange/40 to-seeket-red-vibrant/40 sm:h-7 sm:w-7">
              <User className="h-3.5 w-3.5 text-white/90 sm:h-4 sm:w-4" strokeWidth={1.75} />
            </div>
            <span className="hidden max-w-[120px] truncate sm:inline">@Ariel Felipe</span>
          </div>
        </nav>
      </div>
    </header>
  );
}