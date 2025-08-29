import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailSenderService } from './mail-sender.service';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { MailController } from './mail.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [
    MailSenderService,
    MailService,
    MailProcessor
  ],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule { }
