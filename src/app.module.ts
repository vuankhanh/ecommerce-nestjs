import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductModule } from './module/product/product.module';
import { CustomerModule } from './module/customer/customer.module';
import { OrderModule } from './module/order/order.module';
import { PaymentModule } from './module/payment/payment.module';
import { MongodbProvider } from './provider/database/mongodb.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumModule } from './module/album/album.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './module/auth/auth.module';

import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { CustomLoggerModule } from './module/custom_logger/custom_logger.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/exception/http_exception.filter';
import { SupplierProductModule } from './module/supplier/supplier_product/supplier_product.module';
import { VnPublicApisModule } from './module/vn-public-apis/vn-public-apis.module';
import { PurchaseOrderModule } from './module/purchase_order/purchase_order.module';
import { SocketGateway } from './gateway/socket/socket.gateway';
import { ServerConfigModule } from './module/server-config/server-config.module';
import { AdminModule } from './module/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbProvider,
    }),
    JwtModule.register({ global: true }),
    AlbumModule,
    ProductModule,
    CustomerModule,
    OrderModule,
    PaymentModule,
    AuthModule,
    CustomLoggerModule,
    SupplierProductModule,
    VnPublicApisModule,
    PurchaseOrderModule,
    ServerConfigModule,
    AdminModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    SocketGateway,
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
