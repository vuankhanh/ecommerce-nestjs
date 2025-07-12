import { Module } from '@nestjs/common';

import { InfoModule } from './info/info.module';
import { RouterModule } from '@nestjs/core';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    InfoModule,
    OrderModule,
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
          }
        ]
      }
    ]),
  ]
})
export class PersonalModule { }
