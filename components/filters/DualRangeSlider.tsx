'use client';

interface DualRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

/** Rango mín/máx con dos nodos (presupuesto del directorio). */
export default function DualRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 50,
}: DualRangeSliderProps) {
  const [lo, hi] = value;
  const loPct = ((lo - min) / (max - min)) * 100;
  const hiPct = ((hi - min) / (max - min)) * 100;

  const setLo = (next: number) => {
    const clamped = Math.min(next, hi);
    onChange([Math.max(min, clamped), hi]);
  };

  const setHi = (next: number) => {
    const clamped = Math.max(next, lo);
    onChange([lo, Math.min(max, clamped)]);
  };

  return (
    <div className="pt-1">
      <div className="mb-3 flex justify-between text-[10px] font-medium text-white/70 sm:text-[11px]">
        <span className="rounded-md bg-black/40 px-1.5 py-0.5">${lo}</span>
        <span className="rounded-md bg-black/40 px-1.5 py-0.5">
          ${hi}
          {hi >= max ? '+' : ''}
        </span>
      </div>
      <div className="relative h-5">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/15" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-seeket-red-vibrant/85"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => setLo(parseInt(e.target.value, 10))}
          className="pointer-events-none absolute inset-0 z-20 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-seeket-red-vibrant"
          aria-label="Presupuesto mínimo"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => setHi(parseInt(e.target.value, 10))}
          className="pointer-events-none absolute inset-0 z-30 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-seeket-red-vibrant"
          aria-label="Presupuesto máximo"
        />
      </div>
    </div>
  );
}
