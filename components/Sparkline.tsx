export default function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-8 items-end gap-1">
      {values.map((v, i) => (
        <div key={i} className="w-3 bg-accent/70" style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}


