import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Steps } from './entity/step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Steps])]
})
export class StepsModule {}
