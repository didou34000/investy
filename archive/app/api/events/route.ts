import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

type EventRow = {
  id: string;
  name: string;
  ts: number;
  payload?: Record<string, unknown>;
  ip?: string | null;
  ua?: string | null;
};

const memory: EventRow[] = [];
const dataDir = path.join(process.cwd(), ".data");
const eventsPath = path.join(dataDir, "events.json");

async function ensureFiles() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(eventsPath).catch(async () => {
      await fs.writeFile(eventsPath, "[]", "utf8");
    });
  } catch {
    // ignore
  }
}

async function readEvents(): Promise<EventRow[]> {
  try {
    await ensureFiles();
    const raw = await fs.readFile(eventsPath, "utf8");
    const list = JSON.parse(raw) as EventRow[];
    return list.concat(memory);
  } catch {
    return [...memory];
  }
}

async function writeEvents(rows: EventRow[]) {
  // Keep memory bounded to last 1000 events
  const clipped = rows.slice(-1000);
  memory.length = 0;
  for (const r of clipped) memory.push(r);
  try {
    await ensureFiles();
    await fs.writeFile(eventsPath, JSON.stringify(clipped, null, 2), "utf8");
  } catch {
    // ignore write failures (read-only FS)
  }
}

export async function GET() {
  const rows = await readEvents();
  return NextResponse.json({ ok: true, events: rows });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));
  const name = String(body?.eventName || "").slice(0, 64);
  const ts = Number(body?.ts) || Date.now();
  const payload = typeof body?.payload === "object" ? body.payload : undefined;
  if (!name) return NextResponse.json({ ok: false }, { status: 400 });

  const ua = (req.headers.get("user-agent") || "").slice(0, 40) || null;
  const row: EventRow = { id: randomUUID(), name, ts, payload, ip: null, ua };
  const rows = await readEvents();
  rows.push(row);
  await writeEvents(rows);
  return NextResponse.json({ ok: true, id: row.id });
}


