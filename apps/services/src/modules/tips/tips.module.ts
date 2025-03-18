import { Module } from '@nestjs/common';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tips } from './entity/tips.entity';
import { GenresModule } from './genres/genres.module';
import { TipGenres } from './genres/entity/genres.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tips, TipGenres]), GenresModule],
  controllers: [TipsController],
  providers: [TipsService]
})
export class TipsModule {}
