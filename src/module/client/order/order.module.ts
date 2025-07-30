import { Module } from '@nestjs/common';
import { OrderVisitorController } from './order-visitor.controller';
import { OrderLoyaltyController } from './order-loyalty.controller';
import { OrderBasicModule } from 'src/module/order-basic/order-basic.module';
import { ProductModule } from '../product/product.module';
import { MailModule } from 'src/module/mail/mail.module';

@Module({
  imports: [
    OrderBasicModule,
    ProductModule,
    MailModule
  ],
  controllers: [OrderVisitorController, OrderLoyaltyController],
})
export class OrderModule {}
