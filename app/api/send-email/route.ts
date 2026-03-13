import { NextRequest, NextResponse } from "next/server";
import { sendEmail, replyTemplate, autoReplyTemplate } from "@/lib/resend";
import { createServerClient } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, ...data } = body;

    if (type === "reply") {
      // Admin replying to a client message
      const { fromName, fromEmail, toEmail, toName, subject, message, originalMessage, messageId } = data;

      const html = replyTemplate({
        clientName: toName,
        adminMessage: message,
        originalMessage: originalMessage,
        senderName: fromName,
      });

      const result = await sendEmail({
        from: `${fromName} <${fromEmail}>`,
        to: toEmail,
        subject: subject || `Re: Your inquiry to ${fromName}`,
        html,
        replyTo: fromEmail,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      // Log the email
      try {
        const supabase = createServerClient();
        await supabase.from("email_logs").insert([{
          from_email: fromEmail,
          to_email: toEmail,
          subject: subject || `Re: Your inquiry to ${fromName}`,
          body: message,
          status: "sent",
          message_id: messageId,
        }]);

        // Mark message as read
        if (messageId) {
          await supabase.from("messages").update({ status: "read" }).eq("id", messageId);
        }
      } catch (logErr) {
        console.error("Log error:", logErr);
      }

      return NextResponse.json({ success: true, id: result.id });
    }

    if (type === "auto_reply") {
      // Auto-reply when contact form is submitted
      const { toEmail, toName, service, fromName, fromEmail, contactEmail } = data;

      const html = autoReplyTemplate({
        clientName: toName,
        service,
        senderName: fromName,
        contactEmail: contactEmail || fromEmail,
      });

      const result = await sendEmail({
        from: `${fromName} <${fromEmail}>`,
        to: toEmail,
        subject: `We received your inquiry — ${fromName}`,
        html,
        replyTo: fromEmail,
      });

      return NextResponse.json({ success: result.success, error: result.error });
    }

    return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
