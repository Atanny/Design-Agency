interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY is not configured." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: options.from,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message || "Failed to send email." };
    }

    return { success: true, id: data.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

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
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: #18181b; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">${senderName}</h1>
        </div>
        <p>Hi ${clientName},</p>
        <div style="background: #f4f4f5; padding: 16px; border-radius: 8px; margin: 16px 0; white-space: pre-wrap;">
          ${adminMessage}
        </div>
        <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
        <p style="color: #71717a; font-size: 13px;">Your original message:</p>
        <div style="color: #71717a; font-size: 13px; padding: 12px; border-left: 3px solid #e4e4e7; margin: 8px 0;">
          ${originalMessage}
        </div>
        <p style="color: #71717a; font-size: 12px; margin-top: 32px;">— ${senderName}</p>
      </body>
    </html>
  `;
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
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: #18181b; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">${senderName}</h1>
        </div>
        <p>Hi ${clientName},</p>
        <p>Thank you for reaching out! We've received your inquiry${service ? ` about <strong>${service}</strong>` : ""} and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to reply to this email if you have any questions.</p>
        <p style="margin-top: 32px;">Best regards,<br /><strong>${senderName}</strong><br /><a href="mailto:${contactEmail}" style="color: #d97706;">${contactEmail}</a></p>
      </body>
    </html>
  `;
}
