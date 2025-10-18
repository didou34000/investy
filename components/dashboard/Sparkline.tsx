"use client";
import dynamic from "next/dynamic";
const ResponsiveContainer = dynamic(()=>import("recharts").then(m=>m.ResponsiveContainer), { ssr:false });
const LineChart = dynamic(()=>import("recharts").then(m=>m.LineChart), { ssr:false });
const Line = dynamic(()=>import("recharts").then(m=>m.Line), { ssr:false });

export default function Sparkline({ data }:{ data:{t:string;p:number}[] }){
  if(!data || !data.length) return <div className="h-8 w-28 bg-slate-100 rounded" />;
  
  return (
    <div className="h-8 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="monotone" 
            dataKey="p" 
            dot={false} 
            stroke="#3B82F6" 
            strokeWidth={2}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
