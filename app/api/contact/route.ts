import { NextResponse } from "next/server";
import { Resend } from "resend";
import { esc } from "@/lib/quoteEmail";

const CONTACT_TO = ["info@makatu.co.za"];
const FROM = process.env.RESEND_FROM || "Makatu <noreply@makatu.co.za>";
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  const name = str(body?.name, 200);
  const email = str(body?.email, 254);
  const phone = str(body?.phone, 50);
  const message = str(body?.message, 5000);
  const emailValid = EMAIL_RE.test(email);

  if (!name || !message || (!emailValid && !phone)) {
    return NextResponse.json(
      {
        success: false,
        error: "Please enter your name, a message, and a valid email or phone number.",
      },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await getResend().emails.send({
      from: FROM,
      to: CONTACT_TO,
      ...(emailValid ? { replyTo: email } : {}),
      subject: `New Contact Form Submission - ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(phone)}</p>
        <p style="white-space:pre-wrap"><strong>Message:</strong> ${esc(message)}</p>
      `,
    });

    if (error) {
      console.error("Contact email rejected by Resend:", error.name, error.message);
      return NextResponse.json(
        { success: false, error: "Message could not be sent" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact email failed:", err);
    return NextResponse.json(
      { success: false, error: "Message could not be sent" },
      { status: 500 },
    );
  }
}
