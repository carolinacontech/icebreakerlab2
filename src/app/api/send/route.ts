import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY no está configurada: el formulario no puede enviar correos.");
    return NextResponse.json({ error: "Email service is not configured" }, { status: 503 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const formData = await req.formData();
  const summary = formData.get("summary") as string;
  const businessName = formData.get("businessName") as string;

  const attachments: { filename: string; content: Buffer }[] = [];
  for (const [, value] of formData.entries()) {
    if (value instanceof File && value.size > 0) {
      const buffer = await value.arrayBuffer();
      attachments.push({ filename: value.name, content: Buffer.from(buffer) });
    }
  }

  const { error } = await resend.emails.send({
    from: "Frost — The Icebreakerlab <onboarding@resend.dev>",
    to: "carolina@carolinaconte.com",
    subject: `New project inquiry — ${businessName || "Website project"}`,
    text: summary,
    attachments,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
