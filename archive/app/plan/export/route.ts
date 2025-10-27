import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(){
  // Placeholder PDF response for MVP; integrate @react-pdf/renderer later
  const pdf = Buffer.from("Investy — Export PDF (à implémenter)", "utf8");
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=plan.pdf"
    }
  });
}


