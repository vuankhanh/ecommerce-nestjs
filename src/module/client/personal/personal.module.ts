import { Module } from '@nestjs/common';

import { InfoModule } from './info/info.module';
import { RouterModule } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'client',
        module: PersonalModule,
        children: [
          {
            path: 'info',
            module: InfoModule,
          },
          {
            path: 'order',
            module: OrderModule,
          },
          {
            path: 'address',
            module: AddressModule,
          }
        ]
      }
    ]),
    InfoModule,
    OrderModule,
    AddressModule,
  ]
})
export class PersonalModule { }
