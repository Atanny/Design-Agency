// Email sending via Resend (resend.com)
// Sign up at resend.com, verify your domain, get API key
// Add RESEND_API_KEY to your .env.local

export interface SendEmailOptions {
  from: string;       // e.g. "Lumis Studio <hello@lumisstudio.com>"
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY is not set in environment variables." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: opts.from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Email send failed" };
    }
    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// Email HTML templates
export function replyTemplate({
  clientName,
  adminMessage,
  originalMessage,
  senderName,
}: {
  clientName: string;
  adminMessage: string;
  originalMessage: string;
  senderName: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reply from ${senderName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#0a0a0a;padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <span style="display:inline-block;width:36px;height:36px;background:linear-gradient(135deg,#c8891a,#e8bd5a);border-radius:8px;text-align:center;line-height:36px;color:#fff;font-weight:700;font-size:16px;vertical-align:middle;margin-right:10px;">L</span>
              <span style="color:#ffffff;font-size:20px;font-weight:700;vertical-align:middle;">${senderName}</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
              <p style="color:#71717a;font-size:14px;margin:0 0 8px;">Hi ${clientName},</p>
              <div style="color:#18181b;font-size:16px;line-height:1.7;margin:0 0 32px;">${adminMessage.replace(/\n/g, "<br>")}</div>

              <!-- Original message -->
              <div style="border-left:3px solid #e4e4e7;padding:16px 20px;background:#fafafa;border-radius:0 8px 8px 0;margin-bottom:32px;">
                <p style="color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">Your original message</p>
                <p style="color:#71717a;font-size:14px;margin:0;line-height:1.6;">${originalMessage}</p>
              </div>

              <p style="color:#18181b;font-size:15px;margin:0 0 4px;">Warm regards,</p>
              <p style="color:#18181b;font-size:15px;font-weight:600;margin:0;">${senderName}</p>

              <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0;">
              <p style="color:#a1a1aa;font-size:12px;text-align:center;margin:0;">
                This email was sent in response to your inquiry. Please reply directly to this email if you have further questions.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function autoReplyTemplate({
  clientName,
  service,
  senderName,
  contactEmail,
}: {
  clientName: string;
  service?: string;
  senderName: string;
  contactEmail: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>We received your message</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:#0a0a0a;padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <span style="display:inline-block;width:36px;height:36px;background:linear-gradient(135deg,#c8891a,#e8bd5a);border-radius:8px;text-align:center;line-height:36px;color:#fff;font-weight:700;font-size:16px;vertical-align:middle;margin-right:10px;">L</span>
              <span style="color:#ffffff;font-size:20px;font-weight:700;vertical-align:middle;">${senderName}</span>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
              <h2 style="color:#18181b;font-size:22px;margin:0 0 16px;">We got your message!</h2>
              <p style="color:#71717a;font-size:15px;line-height:1.7;margin:0 0 16px;">
                Hi ${clientName}, thank you for reaching out${service ? ` about <strong>${service}</strong>` : ""}. We've received your inquiry and will get back to you within <strong>24 hours</strong>.
              </p>
              <p style="color:#71717a;font-size:15px;line-height:1.7;margin:0 0 32px;">
                In the meantime, feel free to browse our portfolio or reach us directly at <a href="mailto:${contactEmail}" style="color:#c8891a;">${contactEmail}</a>.
              </p>
              <p style="color:#18181b;font-size:15px;margin:0;">Warm regards,<br><strong>${senderName}</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
