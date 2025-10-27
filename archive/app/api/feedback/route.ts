import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Payload = { message?: string; email?: string };
type Row = { id: string; message: string; email?: string | null; created_at: number };

const dataDir = path.join(process.cwd(), ".data");
const filePath = path.join(dataDir, "feedback.json");

async function ensure() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(filePath).catch(async () => fs.writeFile(filePath, "[]", "utf8"));
  } catch {}
}

async function readAll(): Promise<Row[]> {
  try {
    await ensure();
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as Row[];
  } catch {
    return [];
  }
}

async function writeAll(rows: Row[]) {
  try {
    await ensure();
    await fs.writeFile(filePath, JSON.stringify(rows, null, 2), "utf8");
  } catch {}
}

export async function GET() {
  const rows = await readAll();
  return NextResponse.json({ ok: true, feedback: rows });
}

export async function POST(request: Request) {
  const data = (await request.json().catch(() => ({}))) as Payload;
  const message = (data.message || "").trim();
  const email = (data.email || "").trim() || undefined;
  if (!message) {
    return NextResponse.json({ ok: false, error: "Message manquant" }, { status: 400 });
  }
  const rows = await readAll();
  rows.push({ id: `${Date.now()}-${rows.length}`, message, email, created_at: Date.now() });
  await writeAll(rows);
  return NextResponse.json({ ok: true });
}


