import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../admin/models/admin.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Response } from 'express';
import { SignInDto } from './dto/admin-signin.dto';
// import { CreateUserDto } from '../user/dto/create-user.dto';
// import { User } from '../user/models/user.model';
import { MailService } from '../mail/mail.service';
import { Client } from '../client/models/client.model';
import { CreateClientDto } from '../client/dto/create-client.dto';
import * as otpGenerator from 'otp-generator';
import { Otp } from '../otp/models/otp.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    @InjectModel(Client) private clientModel: typeof Client,
    @InjectModel(Otp) private otpModel: typeof Otp,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  //===================== TOKEN GENERATION ======================
  async generateToken(payload: any) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  //===================== REFRESH TOKEN ======================
  async refreshToken(id: number, refresh_token: string, res: Response) {
    try {
      const verified_token = await this.jwtService.verify(refresh_token, {
        secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
      });

      if (!verified_token || id != verified_token.id) {
        throw new ForbiddenException('Forbidden or invalid refresh token');
      }

      const payload = { id: verified_token.id, email: verified_token.email };
      const token = this.jwtService.sign(payload, {
        secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      });

      return { id: id, access_token: token };
    } catch (error) {
      throw new BadRequestException('Error refreshing token');
    }
  }

  //===================== ADMIN SIGN UP ======================
  async adminSignUp(createAdminDto: CreateAdminDto, res: Response) {
    const existingPhone = await this.adminModel.findOne({
      where: { phone_number: createAdminDto.phone_number },
    });
    const existingEmail = await this.adminModel.findOne({
      where: { email: createAdminDto.email },
    });
    const existingCreator = await this.adminModel.findOne({
      where: { is_creator: true },
    });
    if (existingPhone)
      throw new BadRequestException('Phone Number already exists');
    if (existingEmail) throw new BadRequestException('Email already exists');

    if (createAdminDto.password !== createAdminDto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
    const isCreator = !existingCreator;

    const newAdmin = await this.adminModel.create({
      ...createAdminDto,
      is_creator: isCreator,
      is_active: false,
      hashed_password,
    });

    const tokens = await this.generateToken({
      id: newAdmin.id,
      email: newAdmin.email,
      is_active: newAdmin.is_active,
      is_creator: newAdmin.is_creator,
    });

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await newAdmin.update({ hashed_refresh_token });
    const activation_link = uuid.v4();
    const updatedAdmin = await this.adminModel.update(
      { hashed_refresh_token, activation_link },
      { where: { id: newAdmin.id }, returning: true },
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    try {
      await this.mailService.sendMail(updatedAdmin[1][0]);
    } catch (error) {
      // console.log(error);
      throw new BadRequestException('Error sending link to email');
    }

    return {
      message:
        'Admin successfully registered, Activation link sent to the provided email.',
      admin: updatedAdmin[1][0],
      access_token: tokens.access_token,
    };
  }

  //===================== ADMIN SIGN IN ======================
  async adminSignIn(signInDto: SignInDto, res: Response) {
    const { email, password } = signInDto;
    const admin = await this.adminModel.findOne({ where: { email } });
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.hashed_password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const tokens = await this.generateToken({
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    });

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await admin.update({ hashed_refresh_token, is_active: true });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    return res.json({
      message: 'Admin signed in successfully',
      id: admin.id,
      access_token: tokens.access_token,
    });
  }

  //===================== ADMIN SIGN OUT ======================
  async adminSignOut(refreshToken: string, res: Response, id: number) {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      admin.hashed_refresh_token,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await admin.update({ hashed_refresh_token: '' });

    res.clearCookie('refresh_token', { httpOnly: true });
    return { message: 'Admin signed out successfully', id };
  }

  async activateAdmin(link: string, res: Response) {
    try {
      const admin = await this.adminModel.findOne({
        where: { activation_link: link },
      });
      if (!admin) {
        return res.status(400).send({ message: 'Foydalanuvchi topilmadi!' });
      }

      if (admin.is_active) {
        return res
          .status(400)
          .send({ message: 'Foydalanuvchi allaqachon faollashtirilgan.' });
      }

      admin.is_active = true;
      await admin.save();

      res.send({
        is_active: admin.is_active,
        message: 'Foydalanuvchi muvaffaqiyatli faollashtirildi.',
      });
    } catch (error) {
      // console.log(error);
    }
  }

  // // ======================= CLIENT ========================

  async generateTokenClient(client: Client) {
    const payload = {
      id: client.id,
      email: client.email,
      is_active: client.is_active,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async clientSignUp(createClientDto: CreateClientDto, res: Response) {
    const client = await this.clientModel.findOne({
      where: { email: createClientDto.email },
    });
    const existingPhone = await this.clientModel.findOne({
      where: { phone_number: createClientDto.phone_number },
    });

    if (client) {
      throw new BadRequestException(
        "Bu email orqali allaqachon ro'yxattan o'tilgan",
      );
    }
    if (existingPhone) {
      throw new BadRequestException('Bunday telefon raqam allaqachon mavjud');
    }

    if (createClientDto.password !== createClientDto.confirm_password) {
      throw new BadRequestException('Parollar mos emas');
    }

    const hashed_password = await bcrypt.hash(createClientDto.password, 7);
    const newClient = await this.clientModel.create({
      ...createClientDto,
      hashed_password,
    });
    const tokens = await this.generateTokenClient(newClient);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    // const activation_link = uuid.v4();
    const updatedClient = await this.clientModel.update(
      { hashed_refresh_token },
      { where: { id: newClient.id }, returning: true },
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    // try {
    //   await this.mailService.sendOtp(updatedClient[1][0]);
    // } catch (error) {
    //   // console.log(error);
    //   throw new BadRequestException('Xat yuborishda xatolik');
    // }
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const email = createClientDto.email;

    const isSend = await this.mailService.sendOtp(email, otp);

    if (!isSend) {
      throw new BadRequestException('OTP yuborishda xatolik yuz berdi.');
    }

    const now = new Date();
    const expiration_time = new Date(now.getTime() + 2 * 60000); // 2 minutes

    await this.otpModel.destroy({ where: { email } });

    const newOtp = await this.otpModel.create({
      id: uuid.v4(),
      otp,
      expiration_time,
      email,
    });

    const encodedData = Buffer.from(
      JSON.stringify({
        email,
        otp_id: newOtp.id,
        timestamp: now,
      }),
    ).toString('base64');

    return {
      message: `OTP code has been sent to ${email}`,
      verification_key: encodedData,
    };
  }

  async newOtp(
    email: string,
  ): Promise<{ message: string; verification_key: string }> {
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const client = await this.clientModel.findOne({ where: { email } });
    if (!client) {
      throw new BadRequestException(`Email ${email} does not exists!`);
    } else if (client.is_active === true) {
      throw new BadRequestException('Client already activated!');
    }

    const isSend = await this.mailService.sendOtp(email, otp);

    if (!isSend) {
      throw new BadRequestException('Error sending OTP');
    }

    const now = new Date();
    const expiration_time = new Date(now.getTime() + 2 * 60000); // 2 minutes

    await this.otpModel.destroy({ where: { email } });

    const newOtp = await this.otpModel.create({
      id: uuid.v4(),
      otp,
      expiration_time,
      email,
    });

    const encodedData = Buffer.from(
      JSON.stringify({
        email,
        otp_id: newOtp.id,
        timestamp: now,
      }),
    ).toString('base64');

    return {
      message: `OTP code has been sent to ${email}`,
      verification_key: encodedData,
    };
  }

  async verifyOtp(
    verification_key: string,
    otp: string,
    email: string,
  ): Promise<any> {
    const decodedData = JSON.parse(
      Buffer.from(verification_key, 'base64').toString('ascii'),
    );

    if (decodedData.email !== email) {
      throw new BadRequestException('Bu email uchun OTP yuborilmagan.');
    }

    const otpRecord = await this.otpModel.findOne({
      where: { id: decodedData.otp_id },
    });

    if (!otpRecord) {
      throw new BadRequestException('OTP mavjud emas.');
    }

    if (otpRecord.verified) {
      throw new BadRequestException('Bu OTP avval tekshirilgan.');
    }

    if (otpRecord.expiration_time < new Date()) {
      throw new BadRequestException('OTPning vaqti tugagan.');
    }

    if (otpRecord.otp !== otp) {
      throw new BadRequestException('OTP mos emas.');
    }

    await this.otpModel.update({ verified: true }, { where: { email } });

    await this.clientModel.update({ is_active: true }, { where: { email } });

    const user = await this.clientModel.findOne({ where: { email } });

    return {
      message: 'OTP successfully confirmed',
      user: user,
    };
  }

  async clientSignIn(clientSignInDto: SignInDto, res: Response) {
    const { email, password } = clientSignInDto;
    const client = await this.clientModel.findOne({
      where: { email },
    });

    if (!client) {
      throw new UnauthorizedException('client topilmadi');
    }

    const validPassword = await bcrypt.compare(
      password,
      client.hashed_password,
    );
    if (!validPassword) {
      throw new UnauthorizedException("Noto'g'ri parol");
    }

    const tokens = await this.generateTokenClient(client);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    await this.clientModel.update(
      { hashed_refresh_token },
      { where: { email: email } },
    );
    return res.json({
      message: 'Tizimga muvaffaqiyatli kirildi',
      id: client.id,
      access_token: tokens.access_token,
    });
  }

  async clientSignOut(refreshToken: string, res: Response, id: number) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const client = await this.clientModel.findOne({
        where: { id: payload.id },
      });
      if (!client) {
        throw new UnauthorizedException('This client not found');
      }

      if (Number(id) !== Number(client.id)) {
        throw new BadRequestException('Invalid id or token');
      }

      const valid_refresh_token = await bcrypt.compare(
        refreshToken,
        client.hashed_refresh_token,
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException("So'rovda xatolik");
      }

      res.clearCookie('refresh_token', {
        httpOnly: true,
      });

      await this.clientModel.update(
        { hashed_refresh_token: '' },
        { where: { id: payload.id } },
      );

      return { message: 'client success signout', id: payload.id };
    } catch (error) {
      throw new BadRequestException('Internal server error');
    }
  }

  //===================== REFRESH TOKEN ======================
  async refreshTokenClient(id: number, refresh_token: string, res: Response) {
    try {
      const verified_token = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!verified_token || id != verified_token.id) {
        throw new ForbiddenException('Forbidden or invalid refresh token');
      }

      const payload = { id: verified_token.id, email: verified_token.email };
      const token = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      });

      return { id: id, access_token: token };
    } catch (error) {
      throw new BadRequestException('Error refreshing token');
    }
  }
}
