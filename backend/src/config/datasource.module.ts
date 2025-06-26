import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProvider } from './database.provider';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseProvider.useFactory,
    }),
  ],
})
export class DataSourceModule implements OnModuleInit {
  private readonly logger = new Logger(DataSourceModule.name);

  onModuleInit() {
    this.logger.log('Connected to the database');
  }
}
