import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OrderPlainEntity } from '../order-basic/entity/order-plain.entity';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async queueOrderReceivedEmail(order: OrderPlainEntity) {
    await this.mailQueue.add('send', { type: 'order-received', order });
  }

  async queueOrderChangedEmail(
    order: OrderPlainEntity,
    orderChanged: Partial<OrderPlainEntity>,
  ) {
    await this.mailQueue.add('send', {
      type: 'order-changed',
      order,
      orderChanged,
    });
  }

  async queueOrderCancelledEmail(order: OrderPlainEntity) {
    await this.mailQueue.add('send', { type: 'order-canceled', order });
  }
}
