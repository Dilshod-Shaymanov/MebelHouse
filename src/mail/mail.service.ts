import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Admin } from '../admin/models/admin.model';
// import { User } from "../user/models/user.model";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(admin: Admin) {
    const url = `${process.env.API_URL}:${process.env.PORT}/api/auth/activate/${admin.activation_link}`;
    await this.mailerService.sendMail({
      to: admin.email,
      subject: 'Welcome to Mebel House',
      template: './confirm',
      context: {
        full_name: admin.full_name,
        url,
      },
    });
  }

  async sendOtp(email: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your OTP',
        template: './otp',
        context: {
          otp,
        },
      });
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return false;
    }
  }
}
