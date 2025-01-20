import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  async generateToken(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };

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

  // async refreshToken(id: number, refresh_token: string, res: Response) {
  //   try {
  //     const verified_token = await this.jwtService.verify(refresh_token, {
  //       secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
  //     });
  //     if (!verified_token) {
  //       throw new UnauthorizedException('Unauthorized token');
  //     }
  //     if (id != verified_token.id) {
  //       throw new ForbiddenException('Forbidden admin');
  //     }
  //     const payload = { id: verified_token.id, login: verified_token.login };
  //     const token = this.jwtService.sign(payload, {
  //       secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
  //       expiresIn: process.env.ACCESS_TOKEN_TIME,
  //     });
  //     return {
  //       token,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error);
  //   }
  // }

  async create(createAdminDto: CreateAdminDto, res: Response) {
    // Check if the email or phone number already exists
    const existingEmail = await this.adminModel.findOne({
      where: { email: createAdminDto.email },
    });
    const existingPhone = await this.adminModel.findOne({
      where: { phone_number: createAdminDto.phone_number },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already registered');
    }

    if (existingPhone) {
      throw new BadRequestException('Phone number already registered');
    }

    // Validate passwords match
    if (createAdminDto.password !== createAdminDto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    // Hash the password
    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);

    // Create a new admin
    const newAdmin = await this.adminModel.create({
      ...createAdminDto,
      is_active: false,
      hashed_password,
    });

    // Generate activation link and tokens
    const activation_link = uuid.v4();
    const tokens = await this.authService.generateToken({
      id: newAdmin.id,
      email: newAdmin.email,
      is_active: newAdmin.is_active,
      is_creator: newAdmin.is_creator,
    });

    // Hash the refresh token
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    // Update the admin with the hashed refresh token and activation link
    const updatedAdmin = await this.adminModel.update(
      { hashed_refresh_token, activation_link },
      { where: { id: newAdmin.id }, returning: true },
    );

    // Set the refresh token in cookies
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    // Send activation email
    try {
      await this.mailService.sendMail(updatedAdmin[1][0]);
    } catch (error) {
      throw new BadRequestException('Error sending activation email');
    }

    // Return response
    return {
      message:
        'Admin created successfully! Activation link sent to the provided email.',
      admin: updatedAdmin[1][0],
      access_token: tokens.access_token,
    };
  }

  async findAll() {
    const admins = await this.adminModel.findAll({ include: { all: true } });
    return {
      data: admins,
      total: admins.length,
    };
  }

  async findOne(id: number) {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) {
      throw new BadRequestException(`ID:${id} Admin does not exists!`);
    }
    return this.adminModel.findOne({ where: { id }, include: { all: true } });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) {
      throw new BadRequestException(`ID:${id} Admin does not exists!`);
    }
    if (!admin.is_creator) {
      const updatedFields = { ...updateAdminDto, is_creator: false };
      const updatedAdmin = await this.adminModel.update(updatedFields, {
        where: { id },
        returning: true,
      });
      return updatedAdmin[1][0];
    } else {
      const updatedFields = { ...updateAdminDto };
      const updatedAdmin = await this.adminModel.update(updatedFields, {
        where: { id },
        returning: true,
      });
      return updatedAdmin[1][0];
    }
  }

  async remove(id: number) {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) {
      throw new BadRequestException(`ID:${id} Admin does not exists!`);
    }
    await this.adminModel.destroy({ where: { id } });
    return { message: `ID: ${id} Admin successfully deleted!` };
  }
}
