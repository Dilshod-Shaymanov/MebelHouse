import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../../order/models/order.model';
import { Client } from '../../client/models/client.model';
import { OrderItems } from '../../order_items/models/order_item.model';

@Injectable()
export class ClientReviewGuard implements CanActivate {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(Client) private readonly clientModel: typeof Client,
    @InjectModel(OrderItems) private readonly orderItemModel: typeof OrderItems,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    // Token borligini tekshirish
    if (!authHeaders) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const [bearer, token] = authHeaders.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized user');
    }

    // Tokenni verify qilish
    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    if (!payload) {
      throw new UnauthorizedException('Unauthorized user');
    }

    // Foydalanuvchi active ekanligini tekshirish
    if (payload.is_active !== true) {
      throw new ForbiddenException({
        message:
          "Sizda bunday huquq yo'q!, Active emassiz, Avtivlashtirish uchun email'ga yuborilgan link ustiga bosing!",
      });
    }

    // Foydalanuvchini yuklab olish
    const client = await this.clientModel.findByPk(payload.id);

    if (!client) {
      throw new UnauthorizedException('Client not found!');
    }

    if (Number(payload.id) !== Number(req.body.clientId)) {
      throw new ForbiddenException("Sizda bunday huquq yo'q!");
    }

    // Client o'zi review qoldirmoqchi bo'lgan mahsulotni tekshiradi
    const productId = req.body.productId;

    // OrderItems va tegishli Orderni tekshirish
    const orderedItem = await this.orderItemModel.findOne({
      where: { productId: productId },
      include: [
        {
          model: this.orderModel,
          as: 'orders',
          where: {
            clientId: payload.id, // Order foydalanuvchiga tegishli bo'lishi kerak
            status: 'shipped', // Order statusi "shipped" bo'lishi kerak
          },
        },
      ],
    });

    if (!orderedItem) {
      throw new ForbiddenException(
        "Siz faqat o'zingiz buyurtma qilgan va yetkazib berilgan mahsulotlarga review qoldira olasiz!",
      );
    }

    return true;
  }
}
