import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DataSourceModule } from '../config/datasource.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    DataSourceModule,    

    //FeatureModule
    UsersModule,
    AuthModule
  ],  
})
export class AppModule {}
