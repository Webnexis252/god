"use server";

import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── helpers ──────────────────────────────────────────────────────────────────

function buildPlainText(fields) {
  return [
    "New Quote Request — Webnexis",
    "",
    `Name:         ${fields.name}`,
    `Email:        ${fields.email}`,
    `Company:      ${fields.company || "Not provided"}`,
    `Project Type: ${fields.projectType}`,
    `Budget:       ${fields.budget}`,
    `Timeline:     ${fields.timeline}`,
    "",
    "Project Brief:",
    fields.details,
    "",
    "— Submitted via the Webnexis contact form",
  ].join("\n");
}

function buildEmailHtml(fields) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0d0d0d;color:#f5f5f5;padding:32px;border-radius:12px;">
      <h2 style="color:#e3b76b;margin-bottom:24px;">New Quote Request — Webnexis</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#aaa;width:140px;">Name</td><td style="padding:8px 0;">${fields.name}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa;">Email</td><td style="padding:8px 0;"><a href="mailto:${fields.email}" style="color:#e3b76b;">${fields.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#aaa;">Company</td><td style="padding:8px 0;">${fields.company || "Not provided"}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa;">Project Type</td><td style="padding:8px 0;">${fields.projectType}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa;">Budget</td><td style="padding:8px 0;">${fields.budget}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa;">Timeline</td><td style="padding:8px 0;">${fields.timeline}</td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;background:#1a1a1a;border-radius:8px;border-left:3px solid #e3b76b;">
        <p style="color:#aaa;margin:0 0 8px;">Project Brief</p>
        <p style="margin:0;white-space:pre-wrap;">${fields.details}</p>
      </div>
    </div>
  `;
}

// ─── Email via Nodemailer (SMTP) ──────────────────────────────────────────────

async function sendEmail(fields) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn("[Email] Gmail env vars not configured — skipping.");
    return { ok: false, error: "Gmail credentials not configured." };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Webnexis Form" <${user}>`,
      to: siteConfig.email,
      replyTo: fields.email,
      subject: `New Quote: ${fields.company || fields.name} — ${fields.projectType}`,
      text: buildPlainText(fields),
      html: buildEmailHtml(fields),
    });
    return { ok: true, error: null };
  } catch (err) {
    console.error("[Email] Send error:", err);
    return { ok: false, error: err.message };
  }
}

// ─── Server Action ────────────────────────────────────────────────────────────

export async function submitLeadAction(_prevState, formData) {
  // 1. Parse fields
  const fields = {
    name:        String(formData.get("name")        || "").trim(),
    email:       String(formData.get("email")       || "").trim(),
    company:     String(formData.get("company")     || "").trim(),
    projectType: String(formData.get("projectType") || "").trim(),
    budget:      String(formData.get("budget")      || "").trim(),
    timeline:    String(formData.get("timeline")    || "").trim(),
    details:     String(formData.get("details")     || "").trim(),
  };

  // 2. Validate
  const errors = {};
  if (!fields.name) errors.name = "Please add your name.";
  if (!fields.email) {
    errors.email = "Please add your email.";
  } else if (!emailPattern.test(fields.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.projectType) errors.projectType = "Select the kind of project you want help with.";
  if (!fields.budget)      errors.budget      = "Select an estimated budget range.";
  if (!fields.timeline)    errors.timeline    = "Select your launch timeline.";
  if (!fields.details || fields.details.length < 30) {
    errors.details = "Share at least a short project brief (30 characters or more).";
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "A few details still need attention before we can review the brief.",
      errors,
      whatsappLink: "",
    };
  }

  // 3. Fire email notification concurrently
  const emailResult = await sendEmail(fields);

  if (!emailResult.ok) {
    console.error("[Action] Email failed:", emailResult.error);
  }

  // 4. Generate the official WhatsApp Click-to-Chat Link
  // Clean phone number (e.g., "+91 95609 67377" -> "919560967377")
  // Using the primary (first) number from config, or default to missing string if undefined
  const rawPhone = siteConfig.phones?.[0] || "";
  let cleanPhone = rawPhone.replace(/[\s\-\+]/g, "");
  // Note: if the number starts with 0 locally, logic may be needed, but we assume international format.
  
  const textMessage = encodeURIComponent(buildPlainText(fields));
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${textMessage}`;

  return {
    status: "success",
    message: "Brief captured! Click below to send this directly to our WhatsApp to instantly open a chat with our team.",
    errors: {},
    whatsappLink,
  };
}
