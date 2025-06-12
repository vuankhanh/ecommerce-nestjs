import { Module } from '@nestjs/common';
import { PurchaseOrderController } from './purchase_order.controller';
import { PurchaseOrderService } from './purchase_order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase_Order, purchaseOrderSchema } from './schema/purchase_order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Purchase_Order.name,
        schema: purchaseOrderSchema,
        collection: Purchase_Order.name.toLowerCase()
      }
    ])
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService]
})
export class PurchaseOrderModule { }
