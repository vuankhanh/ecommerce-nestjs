import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailSenderService } from './mail-sender.service';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';

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
})
export class MailModule { }
