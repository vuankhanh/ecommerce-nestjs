import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CustomerModule } from './module/customer/customer.module';
import { OrderModule } from './module/order/order.module';
import { PaymentModule } from './module/payment/payment.module';
import { MongodbProvider } from './provider/database/mongodb.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './module/auth/auth.module';

import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { CustomLoggerModule } from './module/custom_logger/custom_logger.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/core/exception/http_exception.filter';
import { SupplierProductModule } from './module/supplier/supplier_product/supplier_product.module';
import { VnPublicApisModule } from './module/vn-public-apis/vn-public-apis.module';
import { PurchaseOrderModule } from './module/purchase_order/purchase_order.module';
import { SocketGateway } from './gateway/socket/socket.gateway';
import { ServerConfigModule } from './module/server-config/server-config.module';
import { AdminModule } from './module/admin/admin.module';
import { ProductModule } from './module/client/product/product.module';
import { ProductCategoryModule } from './module/client/product-category/product-category.module';
import { SlideShowModule } from './module/client/slide-show/slide-show.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbProvider,
    }),
    JwtModule.register({ global: true }),
    AdminModule,
    CustomerModule,
    OrderModule,
    PaymentModule,
    AuthModule,
    CustomLoggerModule,
    SupplierProductModule,
    VnPublicApisModule,
    PurchaseOrderModule,
    ServerConfigModule,
    ProductModule,
    ProductCategoryModule,
    SlideShowModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    SocketGateway
  ],
})
export class AppModule {
  static port: number;
  constructor(
    private configService: ConfigService
  ) {
    AppModule.port = this.configService.get<number>('app.port');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
