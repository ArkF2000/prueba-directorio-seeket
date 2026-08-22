'use client';

import { Briefcase, LayoutGrid, User } from 'lucide-react';
import SeeketLogo from '@/components/SeeketLogo';

/**
 * Mock estático del header real de SEEKET. Sin auth, sin datos: solo la fachada visual
 * que enmarca la pantalla del directorio para este reto.
 */
export default function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-[100] w-full border-b border-white/10"
      style={{
        background: 'rgba(22, 23, 22, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <SeeketLogo size="sm" animated={false} className="text-xl" />
        </div>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Principal">
          <span className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white sm:px-4">
            <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Directorio</span>
          </span>

          <span className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 sm:px-4">
            <Briefcase className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span className="hidden sm:inline">Tus servicios</span>
          </span>

          <div className="relative ml-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white sm:ml-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
              <User className="h-4 w-4 text-white/80" strokeWidth={1.5} />
            </div>
            <span className="hidden sm:inline max-w-[120px] truncate">@candidato</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
