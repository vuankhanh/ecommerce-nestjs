import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AccountService } from 'src/shared/service/account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, accountSchema } from 'src/module/auth/schemas/account.schema';
import { delivertySchema, Delivery } from './schema/delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: accountSchema,
        collection: Account.name.toLowerCase()
      },
      {
        name: Delivery.name,
        schema: delivertySchema,
        collection: Delivery.name.toLowerCase()
      }
    ]),
  ],
  controllers: [AddressController],
  providers: [AddressService, AccountService],
})
export class AddressModule { }
