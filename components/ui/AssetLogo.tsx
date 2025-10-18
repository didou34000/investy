"use client";
type Props = { src?: string|null; label?: string; size?: number; className?: string; };

export default function AssetLogo({ src, label, size=28, className }: Props){
  const letter = (label?.trim()?.charAt(0) || "?").toUpperCase();
  const showImg = !!src && /^https?:\/\//.test(src);
  return (
    <div className={`relative rounded-md bg-white border border-slate-200 overflow-hidden ${className||""}`} style={{ width:size, height:size }}>
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={label || ""}
          width={size}
          height={size}
          className="w-full h-full object-contain"
          onError={(e)=>{ e.currentTarget.style.display="none"; (e.currentTarget.parentElement as HTMLElement).style.backgroundImage="url('/assets/placeholders/default.svg')"; }}
        />
      ) : (
        <div className="grid place-items-center w-full h-full">
          <span className="text-[12px] font-semibold text-slate-500">{letter}</span>
        </div>
      )}
    </div>
  );
}