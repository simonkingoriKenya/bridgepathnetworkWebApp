import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[email] Not configured — would send "${payload.subject}" to ${payload.to}`);
    return false;
  }
  try {
    await transporter.sendMail({
      from: `"Bridgepath Africa" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
      ...payload,
    });
    return true;
  } catch (err) {
    console.error("[email] Send failed:", err);
    return false;
  }
}

export function newApplicationEmail(opts: {
  employerName: string;
  employerEmail: string;
  candidateName: string;
  jobTitle: string;
}) {
  return {
    to: opts.employerEmail,
    subject: `New application for ${opts.jobTitle} — Bridgepath Africa`,
    html: `
      <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#1a2340">
        <div style="background:#1a2340;padding:28px 32px;border-radius:12px 12px 0 0">
          <img src="https://bridgepath.africa/logo.svg" alt="Bridgepath Africa" style="height:32px" />
          <h1 style="color:#fff;font-size:22px;margin:16px 0 0">New Application Received</h1>
        </div>
        <div style="background:#f8faf5;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <p style="margin:0 0 16px">Hi <strong>${opts.employerName}</strong>,</p>
          <p style="margin:0 0 16px"><strong>${opts.candidateName}</strong> has applied for the <strong>${opts.jobTitle}</strong> role on Bridgepath Africa.</p>
          <a href="https://bridgepath.africa/dashboard/pipeline" style="display:inline-block;background:#8CC63F;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Review in Pipeline →</a>
          <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">Bridgepath Africa · Shaping People. Strengthening Institutions.</p>
        </div>
      </div>`,
  };
}

export function applicationViewedEmail(opts: {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
}) {
  return {
    to: opts.candidateEmail,
    subject: `Your application for ${opts.jobTitle} was viewed — Bridgepath Africa`,
    html: `
      <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#1a2340">
        <div style="background:#1a2340;padding:28px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;font-size:22px;margin:0">Your profile caught attention 👀</h1>
        </div>
        <div style="background:#f8faf5;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <p style="margin:0 0 16px">Hi <strong>${opts.candidateName}</strong>,</p>
          <p style="margin:0 0 16px">An employer at <strong>${opts.companyName}</strong> viewed your application for <strong>${opts.jobTitle}</strong>. This is a great sign — make sure your profile is up to date!</p>
          <a href="https://bridgepath.africa/dashboard/jobseeker" style="display:inline-block;background:#8CC63F;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">View My Dashboard →</a>
          <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">Bridgepath Africa · Shaping People. Strengthening Institutions.</p>
        </div>
      </div>`,
  };
}

export function feedbackEmail(opts: {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  fromName: string;
  isAnonymous: boolean;
  feedback: string;
}) {
  const sender = opts.isAnonymous ? "An employer" : opts.fromName;
  return {
    to: opts.candidateEmail,
    subject: `New career feedback on your Bridgepath Africa profile`,
    html: `
      <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#1a2340">
        <div style="background:#1a2340;padding:28px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#8CC63F;font-size:22px;margin:0">Career Growth Feedback</h1>
        </div>
        <div style="background:#f8faf5;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
          <p style="margin:0 0 16px">Hi <strong>${opts.candidateName}</strong>,</p>
          <p style="margin:0 0 16px"><strong>${sender}</strong> left you professional feedback regarding your application for <strong>${opts.jobTitle}</strong>:</p>
          <blockquote style="background:#fff;border-left:4px solid #8CC63F;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;font-style:italic;color:#374151">${opts.feedback}</blockquote>
          <a href="https://bridgepath.africa/dashboard/jobseeker" style="display:inline-block;background:#8CC63F;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">View Feedback →</a>
          <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">Bridgepath Africa · Shaping People. Strengthening Institutions.</p>
        </div>
      </div>`,
  };
}
