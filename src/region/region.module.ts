import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Region } from './models/region.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([Region]),
    JwtModule.register({})
  ],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService, SequelizeModule]
})
export class RegionModule {}
