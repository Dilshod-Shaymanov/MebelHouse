import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Address } from './models/address.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Address]),
    JwtModule.register({}),
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService, SequelizeModule],
})
export class AddressesModule {}
