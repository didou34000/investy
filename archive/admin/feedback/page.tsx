"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AnalyticsEvent = {
  id: string;
  user_id: string | null;
  event: string;
  meta: Record<string, unknown> | null;
  created_at: string;
};

export default function FeedbackAdmin(){
  const [rows,setRows]=useState<AnalyticsEvent[]>([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    const { data } = await supabase.from("analytics_events").select("*").order("created_at",{ascending:false});
    setRows(data||[]);
  }
  return (
    <main className="min-h-screen bg-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">📊 Feedback & Analytics</h1>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="p-2">Date</th><th className="p-2">Event</th><th className="p-2">Meta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r)=> (
              <tr key={r.id} className="border-b hover:bg-slate-50">
                <td className="p-2">{new Date(r.created_at).toLocaleString("fr-FR")}</td>
                <td className="p-2 font-medium">{r.event}</td>
                <td className="p-2">{JSON.stringify(r.meta||{})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}


