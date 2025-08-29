import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Order, OrderDocument } from '../order-basic/schema/order.schema';
import { IOrderDetailPopulated } from 'src/shared/interface/order-response.interface';
import { OrderItemPlainEntity, OrderPlainEntity } from '../order-basic/entity/order-plain.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail') private readonly mailQueue: Queue
  ) {}

  async queueOrderReceivedEmail(order: OrderPlainEntity) {
    await this.mailQueue.add('send', { type: 'order-received', order });
  }

  async queueOrderChangedEmail(order: OrderPlainEntity, orderChanged: Partial<OrderPlainEntity>) {
    await this.mailQueue.add('send', { type: 'order-changed', order, orderChanged });
  }

  async queueOrderCancelledEmail(order: OrderPlainEntity) {
    await this.mailQueue.add('send', { type: 'order-canceled', order });
  }
}