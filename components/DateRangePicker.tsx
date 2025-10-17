"use client";

export type RangeKey = "1d" | "7d" | "30d";

export default function DateRangePicker({ value, onChange }: { value: RangeKey; onChange: (v: RangeKey) => void }) {
  return (
    <div className="inline-flex gap-2">
      {(["1d", "7d", "30d"] as RangeKey[]).map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={`rounded-md border px-3 py-1 text-sm ${value === k ? "bg-accent text-white" : "bg-white"}`}
          aria-label={`Filtrer ${k}`}
        >
          {k}
        </button>
      ))}
    </div>
  );
}


