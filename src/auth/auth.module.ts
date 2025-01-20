import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from '../admin/models/admin.model';
// import { User } from '../user/models/user.model';
import { MailModule } from '../mail/mail.module';
import { Otp } from '../otp/models/otp.model';
import { Client } from '../client/models/client.model';
@Module({
  imports: [
    SequelizeModule.forFeature([Admin, Client, Otp]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
