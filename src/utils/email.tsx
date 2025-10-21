import "server-only";

import { SITE_DOMAIN, SITE_URL } from "@/constants";
import { render } from '@react-email/render'
import { ResetPasswordEmail } from "@/react-email/reset-password";
import { VerifyEmail } from "@/react-email/verify-email";
import { TeamInviteEmail } from "@/react-email/team-invite";
import isProd from "./is-prod";
import nodemailer from 'nodemailer';

interface BrevoEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  replyTo?: string;
  htmlContent: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, string>;
  tags?: string[];
}

interface ResendEmailOptions {
  to: string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  text?: string;
  tags?: { name: string; value: string }[];
}

type EmailProvider = "resend" | "brevo" | "smtp" | null;

async function getEmailProvider(): Promise<EmailProvider> {
  if (process.env.RESEND_API_KEY) {
    return "resend";
  }

  if (process.env.BREVO_API_KEY) {
    return "brevo";
  }

  // In development, always use SMTP with Maildev if no other provider is configured
  if (!isProd) {
    return "smtp";
  }

  return null;
}

async function createSMTPTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || process.env.MAILDEV_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || process.env.MAILDEV_PORT || '1025'),
    secure: false, // true for 465, false for other ports
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined,
    // Additional options for better compatibility
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter;
}

async function sendResendEmail({
  to,
  subject,
  html,
  from,
  replyTo: originalReplyTo,
  text,
  tags,
}: ResendEmailOptions) {
  if (!isProd) {
    console.log(`📧 [DEV] Email would be sent to: ${to.join(', ')}`);
    console.log(`📧 [DEV] Subject: ${subject}`);
    console.log(`📧 [DEV] HTML Content: ${html.substring(0, 200)}...`);
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const replyTo = originalReplyTo ?? process.env.EMAIL_REPLY_TO;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    } as const,
    body: JSON.stringify({
      from: from ?? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
      tags,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send email via Resend: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function sendSMTPEmail({
  to,
  subject,
  html,
  text,
  from,
  replyTo
}: {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}) {
  try {
    const transporter = await createSMTPTransporter();

    const mailOptions = {
      from: from || `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: to.join(', '),
      subject,
      html,
      text,
      replyTo
    };

    console.log(`📧 [SMTP] Sending email to: ${to.join(', ')}`);
    console.log(`📧 [SMTP] Subject: ${subject}`);

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ [SMTP] Email sent successfully: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error(`❌ [SMTP] Failed to send email:`, error);
    throw error;
  }
}

async function sendBrevoEmail({
  to,
  subject,
  replyTo: originalReplyTo,
  htmlContent,
  textContent,
  templateId,
  params,
  tags,
}: BrevoEmailOptions) {
  if (!isProd) {
    console.log(`📧 [DEV] Email would be sent to: ${to.map(t => t.email).join(', ')}`);
    console.log(`📧 [DEV] Subject: ${subject}`);
    console.log(`📧 [DEV] HTML Content: ${htmlContent.substring(0, 200)}...`);
    return;
  }

  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not set");
  }

  const replyTo = originalReplyTo ?? process.env.EMAIL_REPLY_TO;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    } as const,
    body: JSON.stringify({
      sender: {
        name: process.env.EMAIL_FROM_NAME,
        email: process.env.EMAIL_FROM,
      },
      to,
      htmlContent,
      textContent,
      subject,
      templateId,
      params,
      tags,
      ...(replyTo ? {
        replyTo: {
          email: replyTo,
        }
      } : {}),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send email via Brevo: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function sendPasswordResetEmail({
  email,
  resetToken,
  username
}: {
  email: string;
  resetToken: string;
  username: string;
}) {
  const resetUrl = `${SITE_URL}/reset-password?token=${resetToken}`;

  const html = await render(ResetPasswordEmail({ resetLink: resetUrl, username }));
  const provider = await getEmailProvider();

  if (!provider && isProd) {
    throw new Error("No email provider configured. Set either RESEND_API_KEY or BREVO_API_KEY in your environment.");
  }

  if (provider === "smtp") {
    await sendSMTPEmail({
      to: [email],
      subject: `Reset your password for ${SITE_DOMAIN}`,
      html,
    });
  } else if (provider === "resend") {
    await sendResendEmail({
      to: [email],
      subject: `Reset your password for ${SITE_DOMAIN}`,
      html,
      tags: [{ name: "type", value: "password-reset" }],
    });
  } else if (provider === "brevo") {
    await sendBrevoEmail({
      to: [{ email, name: username }],
      subject: `Reset your password for ${SITE_DOMAIN}`,
      htmlContent: html,
      tags: ["password-reset"],
    });
  } else if (!isProd) {
    console.log('\n📧 [DEV] Password reset email would be sent:');
    console.log(`📧 [DEV] To: ${email}`);
    console.log(`📧 [DEV] Username: ${username}`);
    console.log(`📧 [DEV] Reset URL: ${resetUrl}`);
  }
}

export async function sendVerificationEmail({
  email,
  verificationToken,
  username
}: {
  email: string;
  verificationToken: string;
  username: string;
}) {
  const verificationUrl = `${SITE_URL}/verify-email?token=${verificationToken}`;

  const html = await render(VerifyEmail({ verificationLink: verificationUrl, username }));
  const provider = await getEmailProvider();

  if (!provider && isProd) {
    throw new Error("No email provider configured. Set either RESEND_API_KEY or BREVO_API_KEY in your environment.");
  }

  if (provider === "smtp") {
    await sendSMTPEmail({
      to: [email],
      subject: `Verify your email for ${SITE_DOMAIN}`,
      html,
    });
  } else if (provider === "resend") {
    await sendResendEmail({
      to: [email],
      subject: `Verify your email for ${SITE_DOMAIN}`,
      html,
      tags: [{ name: "type", value: "email-verification" }],
    });
  } else if (provider === "brevo") {
    await sendBrevoEmail({
      to: [{ email, name: username }],
      subject: `Verify your email for ${SITE_DOMAIN}`,
      htmlContent: html,
      tags: ["email-verification"],
    });
  } else if (!isProd) {
    console.log('\n📧 [DEV] Email verification would be sent:');
    console.log(`📧 [DEV] To: ${email}`);
    console.log(`📧 [DEV] Username: ${username}`);
    console.log(`📧 [DEV] Verification URL: ${verificationUrl}`);
  }
}

export async function sendTeamInvitationEmail({
  email,
  invitationToken,
  teamName,
  inviterName
}: {
  email: string;
  invitationToken: string;
  teamName: string;
  inviterName: string;
}) {
  const inviteUrl = `${SITE_URL}/team-invite?token=${invitationToken}`;

  const html = await render(TeamInviteEmail({
    inviteLink: inviteUrl,
    recipientEmail: email,
    teamName,
    inviterName
  }));

  const provider = await getEmailProvider();

  if (!provider && isProd) {
    throw new Error("No email provider configured. Set either RESEND_API_KEY or BREVO_API_KEY in your environment.");
  }

  if (provider === "smtp") {
    await sendSMTPEmail({
      to: [email],
      subject: `You've been invited to join a team on ${SITE_DOMAIN}`,
      html,
    });
  } else if (provider === "resend") {
    await sendResendEmail({
      to: [email],
      subject: `You've been invited to join a team on ${SITE_DOMAIN}`,
      html,
      tags: [{ name: "type", value: "team-invitation" }],
    });
  } else if (provider === "brevo") {
    await sendBrevoEmail({
      to: [{ email }],
      subject: `You've been invited to join a team on ${SITE_DOMAIN}`,
      htmlContent: html,
      tags: ["team-invitation"],
    });
  } else if (!isProd) {
    console.log('\n📧 [DEV] Team invitation email would be sent:');
    console.log(`📧 [DEV] To: ${email}`);
    console.log(`📧 [DEV] Team: ${teamName}`);
    console.log(`📧 [DEV] Inviter: ${inviterName}`);
    console.log(`📧 [DEV] Invite URL: ${inviteUrl}`);
  }
}
