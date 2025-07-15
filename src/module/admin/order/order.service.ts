import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { OrderBasicService } from 'src/module/order-basic/order-basic.service';
import { OrderDocument } from 'src/module/order-basic/schema/order.schema';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderBasicService: OrderBasicService,
  ) {

  }
}
