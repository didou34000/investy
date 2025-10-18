type Row = {
  id: string;
  name: string;
  ts: number;
  ua?: string | null;
  payload?: Record<string, unknown>;
};

export default function EventsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Event</th>
            <th className="px-3 py-2 text-left">UA</th>
            <th className="px-3 py-2 text-left">Payload</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2 whitespace-nowrap">{new Date(r.ts).toLocaleString()}</td>
              <td className="px-3 py-2">{r.name}</td>
              <td className="px-3 py-2 max-w-[200px] truncate">{r.ua ?? ""}</td>
              <td className="px-3 py-2 text-slate-600">
                <code className="text-xs break-all">{JSON.stringify(r.payload ?? {})}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


