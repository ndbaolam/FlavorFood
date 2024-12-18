import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../env';
import { DataSourceModule } from '../config/datasource.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    DataSourceModule,    

    //FeatureModule
    UsersModule,
    AuthModule
  ],  
})
export class AppModule {}
