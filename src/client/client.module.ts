import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './models/client.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Client]), JwtModule.register({})],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService, SequelizeModule],
})
export class ClientModule {}
