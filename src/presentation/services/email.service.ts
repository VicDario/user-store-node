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
  postToProvider: boolean;
  mailerService: string;
  mailerEmail: string;
  mailerSecretKey: string;
}

export class EmailService {
  private transporter: Transporter;
  private readonly postToProvider: boolean;

  constructor(options: MailerOptions) {
    const { mailerService, mailerEmail, mailerSecretKey, postToProvider } = options;
    this.postToProvider = postToProvider;
    this.transporter = createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: mailerSecretKey,
      },
    });
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    if (!this.postToProvider) return true;
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