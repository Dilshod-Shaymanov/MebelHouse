import {
  Controller,
  Post,
  Body,
  Res,
  Param,
  Req,
  Get,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin } from '../admin/models/admin.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { Response, Request } from 'express';
import { SignInDto } from './dto/admin-signin.dto';
import { CookieGetter } from '../common/decorators/cookieGetter.decorator';
import { Client } from '../client/models/client.model';
import { CreateClientDto } from '../client/dto/create-client.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailClientDto } from './dto/email-client.dto';
import { AdminSelfGuard } from '../common/guards/admin-self.guard';
import { ClientSelfGuard } from '../common/guards/client-self.guard';
// import { User } from '../user/models/user.model';
// import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AdminCreatorGuard)
  @Post('admin-signup')
  @ApiOperation({ summary: 'SignUp for creator.' })
  @ApiResponse({
    status: 201,
    description: 'Create Admin',
    type: Admin,
  })
  async adminSignUp(
    @Body() createAdminDto: CreateAdminDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.adminSignUp(createAdminDto, res);
    return res.status(201).json(result);
  }

  @Post('admin-signin')
  @ApiOperation({ summary: 'Admin login to the system' })
  @ApiResponse({
    status: 200,
    description: 'Admin signin',
    type: Admin,
  })
  async adminSignIn(@Body() adminSignInDto: SignInDto, @Res() res: Response) {
    return this.authService.adminSignIn(adminSignInDto, res);
  }

  @UseGuards(AdminSelfGuard)
  @ApiOperation({ summary: 'Refresh token to update credentials' })
  @Post('/refreshToken-admin/:id')
  async refreshToken(
    @Param('id') id: number,
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(id, refresh_token, res);
  }

  @UseGuards(AdminSelfGuard)
  @Post('admin-signout/:id')
  @ApiOperation({ summary: 'Admin logout from the system' })
  @ApiResponse({
    status: 200,
    description: 'Admin signout',
  })
  async adminSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    return this.authService.adminSignOut(refreshToken, res, +id);
  }

  @ApiOperation({ summary: 'Link for activate admin' })
  @Get('activate/:link')
  activateAdmin(@Param('link') link: string, @Res() res: Response) {
    return this.authService.activateAdmin(link, res);
  }

  //   // ========================== USER =========================
  @Post('client-signup')
  @ApiOperation({ summary: "Yangi client qo'shish" })
  @ApiResponse({
    status: 201,
    description: 'Create client',
    type: Client,
  })
  async clientSignUp(
    @Body() createClientDto: CreateClientDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.clientSignUp(createClientDto, res);
    return res.status(201).json(result);
  }

  @Post('client-signin')
  @ApiOperation({ summary: 'client tizimga kirish' })
  @ApiResponse({
    status: 200,
    description: 'client signin',
    type: Client,
  })
  async clientSignIn(@Body() clientSignInDto: SignInDto, @Res() res: Response) {
    return this.authService.clientSignIn(clientSignInDto, res);
  }

  @UseGuards(ClientSelfGuard)
  @Post('client-signout/:id')
  @ApiOperation({ summary: 'client tizimdan chiqishi' })
  @ApiResponse({
    status: 200,
    description: 'client signout',
  })
  async clientSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string, // Correct usage of decorator
  ) {
    const refreshToken = req.cookies['refresh_token'];

    return this.authService.clientSignOut(refreshToken, res, +id);
  }

  @Post('newotp')
  @ApiOperation({ summary: 'Generate a new OTP for user' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Failed to send OTP' })
  async newOtp(@Body() emailClientDto: EmailClientDto) {
    if (!emailClientDto.email) {
      throw new BadRequestException('Email is required');
    }

    try {
      const result = await this.authService.newOtp(emailClientDto.email);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verifyotp')
  @ApiOperation({ summary: 'Verify the OTP for user' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Failed to verify OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp, verification_key } = verifyOtpDto;

    if (!email || !otp || !verification_key) {
      throw new BadRequestException(
        'Email, OTP, and verification key are required',
      );
    }

    try {
      const result = await this.authService.verifyOtp(
        verification_key,
        otp,
        email,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(ClientSelfGuard)
  @ApiOperation({ summary: "Client's Refresh token to update credentials" })
  @Post('/refreshToken/:id')
  async refreshTokenClient(
    @Param('id') id: number,
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokenClient(id, refresh_token, res);
  }
}
