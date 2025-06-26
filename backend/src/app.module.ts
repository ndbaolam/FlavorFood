import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourceModule } from './config/datasource.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UploadModule } from './modules/upload/upload.module';
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module';
import { TipsModule } from './modules/tips/tips.module';
import { ReviewModule } from './modules/review/review.module';
import { StoresModule } from './modules/stores/stores.module';
import { PaymentModule } from './modules/payment/payment.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import momoConfig from './config/momo.config';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { EmbeddingModule } from './modules/embedding/embedding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [momoConfig],
    }),
    DataSourceModule,

    //FeatureModule
    UsersModule,
    AuthModule,
    RecipesModule,
    FavoriteModule,
    CategoriesModule,
    UploadModule,
    HealthcheckModule,
    TipsModule,
    ReviewModule,
    StoresModule,
    PaymentModule,
    NotificationsModule,
    InvoiceModule,
    SubscriptionModule,
    EmbeddingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
