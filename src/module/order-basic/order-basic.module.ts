import { Module } from '@nestjs/common';
import { OrderBasicService } from './order-basic.service';
import { ConfigService } from '@nestjs/config';
import { AccountService } from 'src/shared/service/account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from './schema/order.schema';
import { Account, accountSchema } from '../auth/schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: orderSchema,
        collection: Order.name.toLowerCase(),
      },
      {
        name: Account.name,
        schema: accountSchema,
        collection: Account.name.toLowerCase(),
      },
    ]),
  ],
  providers: [OrderBasicService, ConfigService, AccountService],
  exports: [OrderBasicService, AccountService],
})
export class OrderBasicModule {}
