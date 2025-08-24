import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongodbProvider } from './provider/database/mongodb.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { I18nModule, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import { AuthModule } from './module/auth/auth.module';

import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { CustomLoggerModule } from './module/custom_logger/custom_logger.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/core/exception/http_exception.filter';
import { VnPublicApisModule } from './module/vn-public-apis/vn-public-apis.module';
import { SocketGateway } from './gateway/socket/socket.gateway';
import { AdminModule } from './module/admin/admin.module';
import { ClientModule } from './module/client/client.module';
import { MailModule } from './module/mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { BullConfigProvider } from './provider/database/redis.provider';
import { join } from 'path';

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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useClass: BullConfigProvider,
    }),
    JwtModule.register({ global: true }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: { path: join(process.cwd(), '/i18n/'), watch: true },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        HeaderResolver,
      ],
    }),
    AdminModule,
    AuthModule,
    CustomLoggerModule,
    VnPublicApisModule,
    ClientModule,
    MailModule
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
