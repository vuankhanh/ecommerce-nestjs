import { Module } from '@nestjs/common';
import { OrderBasicModule } from 'src/module/order-basic/order-basic.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    OrderBasicModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
