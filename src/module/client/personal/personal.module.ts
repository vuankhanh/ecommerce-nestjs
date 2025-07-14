import { Module } from '@nestjs/common';

import { InfoModule } from './info/info.module';
import { RouterModule } from '@nestjs/core';
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
            path: 'address',
            module: AddressModule,
          }
        ]
      }
    ]),
    InfoModule,
    AddressModule,
  ]
})
export class PersonalModule { }
