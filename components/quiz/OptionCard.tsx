"use client";
type Props = {
  selected?: boolean;
  label: string;
  sublabel?: string;
  onSelect: () => void;
  index?: number; // 1,2,3...
};
export default function OptionCard({ selected, label, sublabel, onSelect, index }: Props){
  return (
    <button
      type="button"
      onClick={onSelect}
      onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); onSelect(); } }}
      aria-pressed={selected}
      className={[
        "w-full text-left px-4 py-4 rounded-2xl border transition focus-ring",
        "bg-white/5",
        selected ? "border-blue-400 ring-2 ring-blue-400/50" : "border-slate-200 hover:border-blue-300",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {typeof index==='number' && (
          <div className={[
            "w-7 h-7 rounded-full text-[12px] grid place-items-center",
            selected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"
          ].join(" ")}>{index}</div>
        )}
        <div className="flex-1">
          <div className="text-[15px] text-slate-900">{label}</div>
          {sublabel && <div className="text-[12px] text-slate-600 mt-0.5">{sublabel}</div>}
        </div>
        <div className={[
          "w-5 h-5 rounded-full border",
          selected ? "bg-blue-500 border-blue-500" : "border-slate-300"
        ].join(" ")} />
      </div>
    </button>
  );
}

