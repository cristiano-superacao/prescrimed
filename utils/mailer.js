import nodemailer from 'nodemailer';

function isEmailConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function buildTransport() {
  const port = Number(process.env.SMTP_PORT);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.isFinite(port) ? port : 587,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendBackupEmailIfConfigured({ to, subject, text, attachments }) {
  try {
    if (!isEmailConfigured()) {
      return { status: 'skipped', reason: 'smtp_not_configured' };
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const transporter = buildTransport();

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      attachments: attachments || []
    });

    return { status: 'sent', messageId: info.messageId };
  } catch (error) {
    return { status: 'failed', error: error?.message || String(error) };
  }
}
