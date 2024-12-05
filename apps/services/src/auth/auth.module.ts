import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.JWT_SECRET'),
        signOptions: { 
          expiresIn: `${configService.get<number>('jwt.JWT_EXPIRES_IN')}s` 
        },
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]  
})

export class AuthModule implements OnModuleInit {
  private readonly logger = new Logger(JwtModule.name);

  onModuleInit() {
    this.logger.log('Registered JWT');
  }
}
