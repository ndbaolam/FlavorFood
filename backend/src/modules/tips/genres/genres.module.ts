import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipGenres } from './entity/genres.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipGenres])],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}
