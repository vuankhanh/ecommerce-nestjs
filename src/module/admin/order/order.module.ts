import { Module } from '@nestjs/common';
import { OrderBasicModule } from 'src/module/order-basic/order-basic.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from '../product/product.module';
import { OrderItemsMapAdminPipe } from 'src/shared/core/pipes/order-items-map-admin.pipe';

@Module({
  imports: [
    OrderBasicModule,
    ProductModule
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderItemsMapAdminPipe
  ]
})
export class OrderModule {}
