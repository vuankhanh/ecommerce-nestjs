import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ProductModule } from '../product/product.module';
import { Order, orderSchema } from 'src/shared/schema/order.schema';
import { OrderPersonalController } from './order-personal.controller';
import { Account, accountSchema } from 'src/module/auth/schemas/account.schema';
import { AccountService } from 'src/shared/service/account.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: orderSchema,
        collection: Order.name.toLowerCase()
      },
      {
        name: Account.name,
        schema: accountSchema,
        collection: Account.name.toLowerCase()
      }
    ]),
    ProductModule
  ],
  controllers: [OrderController, OrderPersonalController],
  providers: [OrderService, ConfigService, AccountService]
})
export class OrderModule {}
