import nodemailer from "nodemailer";

export function getTransporter() {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Missing EMAIL_USER or EMAIL_PASS in environment variables"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

export async function sendEmail({ to, subject, html }) {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(` Error sending email to ${to}`, error);
    throw error;
  }
}
