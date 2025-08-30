import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { AccountService } from 'src/shared/service/account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, accountSchema } from 'src/module/auth/schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: accountSchema,
        collection: Account.name.toLowerCase(),
      },
    ]),
  ],
  controllers: [InfoController],
  providers: [InfoService, AccountService],
})
export class InfoModule {}
