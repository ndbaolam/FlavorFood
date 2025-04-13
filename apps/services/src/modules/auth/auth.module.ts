import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    TypeOrmModule.forFeature([
      Users
    ]),
  ],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule implements OnModuleInit {
  private readonly logger = new Logger(JwtModule.name);

  onModuleInit() {
    this.logger.log('Registered JWT');
  }
}
