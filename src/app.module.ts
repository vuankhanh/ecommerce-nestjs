import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { VnPublicApisModule } from './module/vn-public-apis/vn-public-apis.module';
import { SocketGateway } from './gateway/socket/socket.gateway';
import { ServerConfigModule } from './module/server-config/server-config.module';
import { AdminModule } from './module/admin/admin.module';
import { ClientModule } from './module/client/client.module';

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
    AuthModule,
    CustomLoggerModule,
    VnPublicApisModule,
    ServerConfigModule,
    ClientModule
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
