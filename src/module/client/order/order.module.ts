import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ProductModule } from '../product/product.module';
import { Order, orderSchema } from 'src/shared/schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: orderSchema,
        collection: Order.name.toLowerCase()
      }
    ]),
    ProductModule
  ],
  controllers: [OrderController],
  providers: [OrderService, ConfigService]
})
export class OrderModule {}
