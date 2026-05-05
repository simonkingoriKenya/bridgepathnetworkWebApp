import { Router } from "express";
import { db, contactSubmissionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const router = Router();

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const CONTACT_RECIPIENT = "info@bridgepathnetwork.com";
const FROM_ADDRESS = "Bridgepath Network <onboarding@resend.dev>";

router.post("/contact", async (req, res) => {
  try {
    const { name, company, email, phone, type, message } = req.body as {
      name?: string;
      company?: string;
      email?: string;
      phone?: string;
      type?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim()) {
      res.status(400).json({ error: "Bad Request", message: "Name and email are required" });
      return;
    }

    const [submission] = await db
      .insert(contactSubmissionsTable)
      .values({
        name: name.trim(),
        company: company?.trim() || null,
        email: email.trim(),
        phone: phone?.trim() || null,
        type: type || "General enquiry",
        message: message?.trim() || null,
        emailSent: "pending",
      })
      .returning();

    const resend = getResend();
    let emailSentStatus = "skipped";

    if (resend) {
      try {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: [CONTACT_RECIPIENT],
          replyTo: email.trim(),
          subject: `New Enquiry: ${type || "General"} — ${name.trim()}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <div style="background: #1a2340; padding: 20px 24px; border-radius: 6px 6px 0 0; margin: -24px -24px 24px;">
                <h1 style="color: #ffffff; font-size: 20px; margin: 0;">New Contact Enquiry</h1>
              </div>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Name</td>
                  <td style="padding: 8px 0; font-weight: 600; font-size: 14px;">${name.trim()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                  <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email.trim()}" style="color: #8CC63F;">${email.trim()}</a></td>
                </tr>
                ${company ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Company</td><td style="padding: 8px 0; font-size: 14px;">${company.trim()}</td></tr>` : ""}
                ${phone ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 8px 0; font-size: 14px;">${phone.trim()}</td></tr>` : ""}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Enquiry Type</td>
                  <td style="padding: 8px 0; font-size: 14px;">${type || "General enquiry"}</td>
                </tr>
              </table>

              ${message ? `
              <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #8CC63F;">
                <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message.trim()}</p>
              </div>` : ""}

              <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
                Submitted via bridgepathnetwork.com · ${new Date().toUTCString()}
              </p>
            </div>
          `,
        });

        await resend.emails.send({
          from: FROM_ADDRESS,
          to: [email.trim()],
          subject: "We've received your enquiry — Bridgepath Network",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
              <div style="background: #1a2340; padding: 20px 24px; border-radius: 6px 6px 0 0; margin: -24px -24px 24px;">
                <h1 style="color: #ffffff; font-size: 20px; margin: 0;">Thank you for reaching out</h1>
              </div>

              <p style="font-size: 15px; color: #374151; line-height: 1.6;">Hi ${name.trim()},</p>
              <p style="font-size: 15px; color: #374151; line-height: 1.6;">
                Thank you for contacting Bridgepath Network. We've received your enquiry about <strong>${type || "our services"}</strong> and a member of our team will be in touch within 1–2 business days.
              </p>
              <p style="font-size: 15px; color: #374151; line-height: 1.6;">
                In the meantime, feel free to explore our services or browse available roles on our platform.
              </p>

              <div style="margin: 24px 0; text-align: center;">
                <a href="https://bridgepathnetwork.com/jobs" style="display: inline-block; background: #8CC63F; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  Browse Jobs
                </a>
              </div>

              <p style="font-size: 15px; color: #374151; line-height: 1.6;">
                Best regards,<br/>
                <strong>The Bridgepath Network Team</strong><br/>
                <a href="mailto:info@bridgepathnetwork.com" style="color: #8CC63F;">info@bridgepathnetwork.com</a>
              </p>

              <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
                Bridgepath Network · Accra, Ghana · <a href="https://bridgepathnetwork.com" style="color: #9ca3af;">bridgepathnetwork.com</a>
              </p>
            </div>
          `,
        });

        emailSentStatus = "sent";
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
        emailSentStatus = "failed";
      }

      await db
        .update(contactSubmissionsTable)
        .set({ emailSent: emailSentStatus })
        .where(eq(contactSubmissionsTable.id, submission.id));
    }

    res.status(201).json({
      success: true,
      id: submission.id,
      emailSent: emailSentStatus,
    });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ error: "Internal Server Error", message: "Failed to save enquiry" });
  }
});

export default router;
