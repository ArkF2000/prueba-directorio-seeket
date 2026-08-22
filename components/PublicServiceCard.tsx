'use client';

import { DollarSign, Globe, MapPin } from 'lucide-react';
import GlassCard from './GlassCard';
import ServiceCardPortfolioSlider from './ServiceCardPortfolioSlider';
import { PublicServiceEntry } from '@/lib/types';
import { getCountryNameByCode } from '@/lib/constants/countries-latam';
import { formatAgencyNichosLine } from '@/lib/format-agency-nichos';
import {
  ProfileProgressionSquare,
  ServiceProgressionSquare,
} from '@/components/progression/ProgressionSquareBadge';

interface PublicServiceCardProps {
  service: PublicServiceEntry;
  onOpen?: () => void;
  onOpenProfile?: () => void;
}

function formatLanguages(languages: PublicServiceEntry['languages']): string {
  return languages
    .filter((l) => l.idioma?.trim())
    .map((l) => {
      const name = l.idioma.trim();
      const level = l.nivel?.trim();
      return level ? `${name} — ${level}` : name;
    })
    .join(' · ');
}

export default function PublicServiceCard({ service, onOpen, onOpenProfile }: PublicServiceCardProps) {
  const countryName = service.country ? getCountryNameByCode(service.country) : null;
  const profession = service.profession?.trim() || null;
  const roleLine = service.is_agency
    ? formatAgencyNichosLine(service.agency_nichos)
    : profession;
  const languagesLabel = formatLanguages(service.languages);

  const precioFormatted =
    service.precio_inicial_num != null
      ? new Intl.NumberFormat('es-MX').format(service.precio_inicial_num) + ' USD'
      : null;

  const visibleTags = service.search_tags.slice(0, 4);
  const extraTags = service.search_tags.length - visibleTags.length;

  const visibleMarkets = service.service_markets.slice(0, 4);
  const extraMarkets = service.service_markets.length - visibleMarkets.length;

  const hasMacroCategory = Boolean(service.macro_category_name);
  const hasTags = visibleTags.length > 0;
  const hasMarkets = visibleMarkets.length > 0;

  return (
    <div className="flex h-full w-full min-h-0 flex-col gap-2">
      {/* Burbuja proveedor — clic en cualquier zona → perfil */}
      <button
        type="button"
        onClick={() => onOpenProfile?.()}
        disabled={!onOpenProfile}
        className="w-full shrink-0 rounded-2xl text-left transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-seeket-orange/45 disabled:cursor-default disabled:opacity-100"
      >
        <GlassCard variant="strong" className="w-full border-2 border-white/20 p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 text-base font-bold leading-tight text-white">
              {service.display_name ?? 'Proveedor'}
              <ProfileProgressionSquare tierLevel={service.tier_level} />
            </p>
            {service.is_agency && (
              <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/75">
                Agencia
              </span>
            )}
          </div>
          {roleLine && (
            <p className="mt-1 text-[11px] leading-snug text-white/60">{roleLine}</p>
          )}
          {countryName && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] leading-snug text-white/55">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-seeket-orange/90" />
              {countryName}
            </p>
          )}
          {languagesLabel && (
            <p className="mt-1 inline-flex items-start gap-1.5 text-[11px] leading-snug text-white/50">
              <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" />
              <span className="line-clamp-2">{languagesLabel}</span>
            </p>
          )}
        </GlassCard>
      </button>

      {/* Burbuja servicio — clic → overlay del servicio */}
      <div
        className={`flex min-h-0 flex-1 flex-col ${onOpen ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={onOpen}
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
        onKeyDown={
          onOpen
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpen();
                }
              }
            : undefined
        }
      >
        <GlassCard
          variant="strong"
          className="flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden border-2 border-white/20 p-3"
        >
        <div className="flex shrink-0 items-stretch gap-2.5">
          <h2 className="min-w-0 flex-1 text-sm font-bold leading-snug text-white">
            {service.service_title}
            <ServiceProgressionSquare activeLevel={service.active_service_level} />
          </h2>
          {precioFormatted && (
            <>
              <div className="w-px shrink-0 bg-white/10" aria-hidden />
              <div className="flex shrink-0 flex-col items-start justify-start gap-0.5">
                <p className="text-[8px] font-semibold uppercase tracking-widest text-white/40">
                  Precio inicial
                </p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 shrink-0 text-seeket-orange" />
                  <span className="whitespace-nowrap text-lg font-bold leading-none text-white">
                    {precioFormatted}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {hasMacroCategory && (
          <div className="shrink-0">
            <p className="mb-1 text-[8px] font-semibold uppercase tracking-widest text-white/40">
              Se especializa en
            </p>
            <span className="inline-block max-w-full truncate rounded-full border border-seeket-orange/25 bg-seeket-orange/15 px-2 py-0.5 text-[10px] text-seeket-orange">
              {service.macro_category_name}
            </span>
          </div>
        )}

        {service.portfolio_projects.length > 0 && (
          <div className="min-h-0 shrink-0">
            <p className="mb-1 text-[8px] font-semibold uppercase tracking-widest text-white/40">
              Portafolio
            </p>
            <div onClick={(e) => e.stopPropagation()}>
              <ServiceCardPortfolioSlider projects={service.portfolio_projects} compact />
            </div>
          </div>
        )}

        {(hasTags || hasMarkets) && (
          <div className="flex shrink-0 items-start gap-2.5">
            {hasTags && (
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[8px] font-semibold uppercase tracking-widest text-white/40">
                  Especialidad
                </p>
                <div className="flex flex-wrap gap-1">
                  {visibleTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                  {extraTags > 0 && (
                    <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/50">
                      +{extraTags} más
                    </span>
                  )}
                </div>
              </div>
            )}

            {hasTags && hasMarkets && <div className="w-px shrink-0 self-stretch bg-white/10" />}

            {hasMarkets && (
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[8px] font-semibold uppercase tracking-widest text-white/40">
                  Mercados
                </p>
                <div className="flex flex-wrap gap-1">
                  {visibleMarkets.map((market) => (
                    <span
                      key={market}
                      className="rounded-full border border-seeket-orange/20 bg-seeket-orange/[0.06] px-2 py-0.5 text-[10px] text-seeket-orange/80"
                    >
                      {market}
                    </span>
                  ))}
                  {extraMarkets > 0 && (
                    <span className="rounded-full border border-seeket-orange/20 bg-seeket-orange/[0.06] px-2 py-0.5 text-[10px] text-seeket-orange/50">
                      +{extraMarkets} más
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        </GlassCard>
      </div>
    </div>
  );
}
