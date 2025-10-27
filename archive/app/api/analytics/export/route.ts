import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), ".data");
const eventsPath = path.join(dataDir, "events.json");

export async function GET() {
  try {
    const raw = await fs.readFile(eventsPath, "utf8").catch(() => "[]");
    const rows = JSON.parse(raw) as any[];
    const header = ["id", "name", "ts" , "ua" , "payload"].join(",");
    const lines = rows.map((r) => {
      const payload = JSON.stringify(r.payload ?? {}).replaceAll('"', '""');
      return [r.id, r.name, r.ts, r.ua ?? "", `"${payload}"`].join(",");
    });
    const csv = [header, ...lines].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=events.csv",
      },
    });
  } catch {
    return new NextResponse("id,name,ts,ua,payload\n", { headers: { "Content-Type": "text/csv" } });
  }
}


