import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { error } from 'console';
import { NotFoundError } from 'rxjs';
import { Order } from 'src/order/models/order.model';

@Injectable()
export class AdminClientSelfGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Order) private readonly orderModel: typeof Order,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const [bearer, token] = authHeaders.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
      });
    } catch (error) {
      try {
        payload = await this.jwtService.verify(token, {
          secret: process.env.ACCESS_TOKEN_KEY,
        });

        if (!payload.is_active) {
          throw new ForbiddenException('Client is not active');
        }

        const order = await this.orderModel.findByPk(req.params.id);
        if (!order) {
          throw new NotFoundException('Order not found');
        }

        if (+order.clientId !== payload.id) {
          throw new ForbiddenException('You are not the owner of this order');
        }

        return true;
      } catch (innerError) {
        throw new BadRequestException('Invalid or expired client token');
      }
    }

    if (!payload.is_active) {
      throw new ForbiddenException('Admin is not active');
    }

    return true;
  }
}
