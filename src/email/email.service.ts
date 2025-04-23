import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { sendEmailDto } from './dto/send-email.dto';
import { envs } from 'src/common/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.SMTP_HOST,
      port: envs.SMTP_PORT,
      auth: {
        user: envs.SMTP_USER,
        pass: envs.SMTP_PASS,
      },
    });
  }

  async sendEmail(sendEmailDto: sendEmailDto): Promise<void> {
    const { recipients, subject, html } = sendEmailDto;

    await this.transporter.sendMail({
      from: envs.SMTP_USER,
      to: recipients,
      subject,
      html,
    });
    console.log('Email sent successfully');
  }
}
