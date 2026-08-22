'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import AnimatedBubbles from '@/components/AnimatedBubbles';
import FiltersPanel from '@/components/FiltersPanel';
import {
  DEFAULT_DIRECTORIO_FILTERS,
  type DirectorioFilters,
} from '@/lib/directorio-filters';
import VideoFeed from '@/components/VideoFeed';
import { PERFILES_MOCK } from '@/data/perfiles';
import type { PublicServiceEntry } from '@/lib/types';
import { Sparkles, Search } from 'lucide-react';

type Filters = DirectorioFilters;

/** Delay artificial: preserva la pantalla de carga como parte del diseño a evaluar. */
const MOCK_LOAD_DELAY_MS = 500;

function applyClientSideFilters(services: PublicServiceEntry[], filters: Filters): PublicServiceEntry[] {
  let filtered = services;

  if (filters.countryCodes.length > 0) {
    filtered = filtered.filter(
      (s) => s.country != null && filters.countryCodes.includes(s.country),
    );
  }

  if (filters.profileTier.length > 0) {
    filtered = filtered.filter((s) => filters.profileTier.includes(s.tier_level));
  }

  if (filters.serviceLevel.length > 0) {
    filtered = filtered.filter((s) => filters.serviceLevel.includes(s.active_service_level));
  }

  if (filters.talentType && filters.talentType !== 'both') {
    filtered = filtered.filter((s) =>
      filters.talentType === 'agency' ? s.is_agency : !s.is_agency,
    );
  }

  if (filters.category.length > 0) {
    filtered = filtered.filter((s) =>
      s.macro_category_name ? filters.category.includes(s.macro_category_name) : false,
    );
  }

  if (filters.microCategory.length > 0) {
    filtered = filtered.filter(
      (s) => s.micro_category_name != null && filters.microCategory.includes(s.micro_category_name),
    );
  }

  if (filters.languages.length > 0) {
    filtered = filtered.filter((s) =>
      s.languages.some((l) =>
        filters.languages.some(
          (sel) => l.idioma?.trim().toLowerCase() === sel.trim().toLowerCase(),
        ),
      ),
    );
  }

  if (filters.budgetType) {
    filtered = filtered.filter((s) => {
      if (s.precio_inicial_num == null) return false;
      return (
        s.precio_inicial_num >= filters.budgetRange[0] &&
        s.precio_inicial_num <= filters.budgetRange[1]
      );
    });
  }

  return filtered;
}

function DirectorioLoading() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-h-0 items-center justify-center">
      <div className="text-center">
        <Sparkles className="w-12 h-12 text-seeket-orange animate-pulse mx-auto mb-4" />
        <p className="text-white/70">Cargando directorio...</p>
      </div>
    </div>
  );
}

export default function DirectorioPage() {
  const [services, setServices] = useState<PublicServiceEntry[]>([]);
  const [filteredServices, setFilteredServices] = useState<PublicServiceEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_DIRECTORIO_FILTERS });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setServices(PERFILES_MOCK);
      setFilteredServices(PERFILES_MOCK);
      setLoading(false);
    }, MOCK_LOAD_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const applyFilters = useCallback(() => {
    const qLower = searchQuery.trim().toLowerCase();
    let filtered = [...services];
    if (qLower) {
      filtered = filtered.filter(s =>
        (s.display_name ?? '').toLowerCase().includes(qLower) ||
        s.service_title.toLowerCase().includes(qLower)
      );
    }
    filtered = applyClientSideFilters(filtered, filters);
    setFilteredServices(filtered);
  }, [services, searchQuery, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resultsKey = useMemo(
    () => `${searchQuery.trim()}::${JSON.stringify(filters)}`,
    [searchQuery, filters],
  );

  // El reto es solo la pantalla del feed: el clic conserva su afordancia visual
  // (cursor, hover, focus ring) pero no navega a ningún lado.
  const handleViewStrategy = useCallback((_service: PublicServiceEntry) => {}, []);
  const handleViewProfile = useCallback((_profileId: string) => {}, []);

  if (loading) {
    return <DirectorioLoading />;
  }

  return (
    <div className="relative h-[calc(100vh-3.5rem)] min-h-0 overflow-hidden">
      <AnimatedBubbles />
      <main className="relative z-10 flex h-full min-h-0 gap-3 pl-4 pr-3 pb-4 pt-3 sm:gap-4 sm:pl-5 sm:pr-4 sm:pb-5 sm:pt-4">
        <aside className="hidden min-h-0 lg:flex lg:w-[15.5rem] lg:shrink-0 lg:flex-col lg:gap-2 xl:w-[16.5rem]">
          <div className="flex shrink-0 flex-col">
            <label className="mb-1.5 block text-xs font-semibold text-white/75">Buscar por nombre</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/45" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por nombre o servicio…"
                className="w-full rounded-xl border border-white/15 bg-white/[0.08] py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/35 transition-all focus:border-seeket-red-vibrant/40 focus:outline-none focus:ring-2 focus:ring-seeket-red-vibrant/35"
              />
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl shadow-lg shadow-black/25">
            <FiltersPanel filters={filters} onFiltersChange={setFilters} />
          </div>
        </aside>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {filteredServices.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-white/50 text-sm">No hay servicios que coincidan.</p>
              </div>
            </div>
          ) : (
            <VideoFeed
              services={filteredServices}
              onViewStrategy={handleViewStrategy}
              onViewProfile={handleViewProfile}
              resultsKey={resultsKey}
            />
          )}
        </div>
      </main>
    </div>
  );
}
