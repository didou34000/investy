import { NextResponse } from "next/server";

export async function GET(){
  return NextResponse.json({
    ok: true,
    env: process.env.NEXT_PUBLIC_ENV || "unknown",
    time: new Date().toISOString()
  });
}


