import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, customerSchema } from './schema/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: customerSchema,
        collection: Customer.name.toLowerCase()
      }
    ])
  ],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
