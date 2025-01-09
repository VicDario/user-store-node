import { createTransport, Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  path: string;
}

export interface MailerOptions {
  mailerService: string;
  mailerEmail: string;
  mailerSecretKey: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(options: MailerOptions) {
    const { mailerService, mailerEmail, mailerSecretKey } = options
    this.transporter = createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: mailerSecretKey,
      },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments = [] } = options;
    try {
      const sendInformation = await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}