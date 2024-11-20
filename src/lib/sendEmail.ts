import nodemailer from "nodemailer";

import {
  createHiredEmailTemplate,
  createRejectionEmailTemplate,
} from "@/emailTemplates/emails";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL
  secure: true, // true for SSL
  auth: {
    user: process.env.SMTP_USER, // your Gmail address
    pass: process.env.SMTP_PASS, // your Gmail password or App password
  },
});

export const sendHiredEmail = async (to: string, gigTitle: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"GigX Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Congratulations! You've been hired! 🎉",
      html: createHiredEmailTemplate(gigTitle),
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending hired email:", error);
    throw error;
  }
};

export const sendRejectionEmail = async (to: string, gigTitle: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"GigX Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Update on your application',
      html: createRejectionEmailTemplate(gigTitle)
    });

    console.log('Rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
}
