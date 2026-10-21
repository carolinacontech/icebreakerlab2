import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, service, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Sin la API key, `new Resend(undefined)` lanza y el endpoint devolvía un 500
  // opaco. Se comprueba antes para dar un error diagnosticable.
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY no está configurada: el formulario no puede enviar correos.");
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "The Icebreakerlab <onboarding@resend.dev>",
    to: "carolina@carolinaconte.com",
    replyTo: email,
    subject: `New inquiry — ${service || "Website project"} — ${name}`,
    text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nService: ${service || "Not specified"}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2 style="color:#534AB7;margin-bottom:8px;">New project inquiry</h2>
        <p style="color:#666;margin-bottom:24px;font-size:14px;">Submitted via icebreakerlab.vercel.app</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#999;font-size:13px;width:100px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#999;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#534AB7;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#999;font-size:13px;">Service</td><td style="padding:8px 0;">${service || "—"}</td></tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#f8f8ff;border-radius:8px;border-left:3px solid #534AB7;">
          <p style="margin:0;color:#333;white-space:pre-wrap;font-size:14px;line-height:1.6;">${message}</p>
        </div>
        <p style="margin-top:24px;font-size:12px;color:#999;">Reply directly to this email to respond to ${name}.</p>
      </div>
    `,
  });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
