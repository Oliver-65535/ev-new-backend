import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import { mailerConf } from '@app/configuration';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor() {
    this.nodemailerTransport = createTransport({
      pool: mailerConf.pool,
      host: mailerConf.host,
      port: mailerConf.port,
      secure: mailerConf.secure, // use TLS
      auth: {
        user: mailerConf.user,
        pass: mailerConf.pass,
      },
    });
  }

  async sendMail(options: Mail.Options): Promise<void> {
    const sended = await this.nodemailerTransport.sendMail(options);
    console.log({ sended });
    return;
  }
}
