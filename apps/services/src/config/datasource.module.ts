import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.POSTGRES_HOST'),
        port: configService.get<number>('database.PORT'),
        username: configService.get<string>('database.POSTGRES_USER'),
        password: configService.get<string>('database.POSTGRES_PASSWORD'),
        database: configService.get<string>('database.POSTGRES_DB'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Adjust path if needed
        synchronize: true, // Set to false in production
        autoLoadEntities: true,
        logging: ['error', 'warn'], //Custom logging
      }),
      inject: [ConfigService],
    })
  ]
})

export class DataSourceModule implements OnModuleInit {
  private readonly logger = new Logger(DataSourceModule.name);

  onModuleInit() {
    this.logger.log('Connected to the database');
  }
}