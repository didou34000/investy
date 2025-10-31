import { NextResponse } from "next/server";

type Payload = {
  email?: string;
  profile_key?: string; // PRU/EQU/DYN
  monthly?: number;
  years?: number;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const data = (await request.json().catch(() => ({}))) as Payload;
  const email = (data.email || "").trim();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Email invalide" }, { status: 400 });
  }

  // No-op in dev: simulate success without external services
  return NextResponse.json({ ok: true });
}


