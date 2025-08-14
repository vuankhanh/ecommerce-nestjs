import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailSenderService } from './mail-sender.service';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailSenderService: MailSenderService) {}

  @Process('send')
  async handleSendMail(job: Job) {
    console.log(`Processing mail job: ${job.id}, type: ${job.data.type}`);
    
    const { type, order, orderChanged } = job.data;
    switch (type) {
      case 'order-received':
        await this.mailSenderService.sendOrderReceivedEmail(order);
        break;
      case 'order-changed':
        await this.mailSenderService.sendOrderChangedEmail(order, orderChanged);
        break;
      case 'order-canceled':
        await this.mailSenderService.sendOrderCancelledEmail(order);
        break;
    }
  }
}