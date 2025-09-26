// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic"; // ensure Node runtime

type Payload = {
  Name: string;
  Company: string;
  Email: string;
  Contact: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Payload;

    // Basic validation
    if (data.website) {
      // Honeypot filled => likely bot; pretend success
      return NextResponse.json({ ok: true });
    }
    if (!data.Name || !data.Company || !data.Email || !data.Contact) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }
    if (!isValidEmail(data.Email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    // SMTP transporter (configure .env)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = process.env.MAIL_FROM || 'IiAS Website <no-reply@iias.in>';
    const to = "solutions@iias.in";

    const subject =
      data.subject?.trim() ||
      `New contact form submission: ${data.Name} (${data.Company})`;

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>New Contact Submission</h2>
        <table cellspacing="0" cellpadding="6" style="border-collapse:collapse">
          <tr><td><strong>Name</strong></td><td>${data.Name}</td></tr>
          <tr><td><strong>Company</strong></td><td>${data.Company}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.Email}</td></tr>
          <tr><td><strong>Contact No.</strong></td><td>${data.Contact}</td></tr>
          <tr><td><strong>Subject</strong></td><td>${data.subject || "-"}</td></tr>
          <tr><td><strong>Message</strong></td><td>${(data.message || "-")
            .replace(/\n/g, "<br/>")}</td></tr>
        </table>
      </div>
    `;

    // 1) Send to IiAS
    await transporter.sendMail({
      from,
      to,
      replyTo: data.Email, // so you can reply directly to the user
      subject,
      html,
    });

    // 2) Send confirmation to user
    const ackSubject = "We received your message";
    const ackHtml = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <p>Hi ${data.Name},</p>
        <p>Thanks for reaching out to IiAS. We’ve received your message and will get back within 2–3 business days.</p>
        <p><strong>Your submission:</strong></p>
        <ul>
          <li>Company: ${data.Company}</li>
          <li>Contact: ${data.Contact}</li>
          <li>Subject: ${data.subject || "-"}</li>
        </ul>
        <p>— IiAS Team</p>
      </div>
    `;
    await transporter.sendMail({
      from,
      to: data.Email,
      subject: ackSubject,
      html: ackHtml,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact route error:", e);
    return NextResponse.json(
      { error: "Unable to send message. Please try again later." },
      { status: 500 }
    );
  }
}
