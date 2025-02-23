// email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  constructor() {
    // Configure your transporter (you can use environment variables for these settings)
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com'
      port:  587,
      secure: false,
      auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: 'Rashid',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }
}
