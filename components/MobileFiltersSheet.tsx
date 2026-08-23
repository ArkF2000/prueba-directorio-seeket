'use client';

import BottomSheet from '@/components/BottomSheet';
import FiltersPanel from '@/components/FiltersPanel';
import type { DirectorioFilters } from '@/lib/directorio-filters';

interface MobileFiltersSheetProps {
  open: boolean;
  onClose: () => void;
  filters: DirectorioFilters;
  onFiltersChange: (filters: DirectorioFilters) => void;
  resultCount: number;
}

export default function MobileFiltersSheet({
  open,
  onClose,
  filters,
  onFiltersChange,
  resultCount,
}: MobileFiltersSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Filtros"
      footer={
        <button type="button" onClick={onClose} className="focus-ring btn-primary w-full text-sm">
          Ver {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
        </button>
      }
    >
      {/* FiltersPanel espera una columna con alto definido (lo tenía en el aside de
          desktop); acá le damos una altura mínima cómoda para el sheet en vez de h-full. */}
      <div className="flex min-h-[60vh] flex-col px-1 pt-1">
        <FiltersPanel filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </BottomSheet>
  );
}