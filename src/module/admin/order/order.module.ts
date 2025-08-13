import { Module } from '@nestjs/common';
import { OrderBasicModule } from 'src/module/order-basic/order-basic.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from '../product/product.module';
import { OrderItemsMapAdminPipe } from 'src/shared/core/pipes/order-items-map-admin.pipe';
import { MailModule } from 'src/module/mail/mail.module';

@Module({
  imports: [
    OrderBasicModule,
    ProductModule,
    MailModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderItemsMapAdminPipe
  ]
})
export class OrderModule {}
