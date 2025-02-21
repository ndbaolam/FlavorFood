import { Module } from '@nestjs/common';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tips } from './entity/tips.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tips])],
  controllers: [TipsController],
  providers: [TipsService]
})
export class TipsModule {}
