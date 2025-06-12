import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './schema/order.schema';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: orderSchema,
        collection: Order.name.toLowerCase()
      }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, ConfigService]
})
export class OrderModule {}
