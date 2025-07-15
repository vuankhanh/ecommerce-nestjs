import { Module } from '@nestjs/common';
import { OrderVisitorController } from './order-visitor.controller';
import { OrderLoyaltyController } from './order-loyalty.controller';
import { OrderBasicModule } from 'src/module/order-basic/order-basic.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    OrderBasicModule,
    ProductModule
  ],
  controllers: [OrderVisitorController, OrderLoyaltyController],
})
export class OrderModule {}
