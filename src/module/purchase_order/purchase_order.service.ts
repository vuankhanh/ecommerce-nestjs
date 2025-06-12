import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { PurchaseOrderDocument, Purchase_Order } from './schema/purchase_order.schema';
import { Document, Types, FilterQuery, FlattenMaps } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PurchaseOrderService implements IBasicService<Purchase_Order> {
  constructor(
    @InjectModel(Purchase_Order.name) private purchaseOrderModel: Model<Purchase_Order>
  ) {}

  async create(data: Purchase_Order): Promise<PurchaseOrderDocument> {
    const purchaseOrder = new this.purchaseOrderModel(data);
    await purchaseOrder.save();
    return purchaseOrder;
  }

  async getAll(filterQuery: FilterQuery<Purchase_Order>, page: number, size: number): Promise<{ data: FlattenMaps<Purchase_Order>[]; paging: IPaging; }> {
    const countTotal = await this.purchaseOrderModel.countDocuments(filterQuery);
    const supplierProductAggregate = await this.purchaseOrderModel.aggregate(
      [
        { $match: filterQuery },
        { $sort: { createdAt: -1 } },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: supplierProductAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };

    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Purchase_Order>): Promise<PurchaseOrderDocument> {
    return await this.purchaseOrderModel.findOne(filterQuery);
  }

  async replace(filterQuery: FilterQuery<Purchase_Order>, data: Purchase_Order): Promise<PurchaseOrderDocument> {
    return await this.purchaseOrderModel.findOneAndReplace(filterQuery, data);
  }

  async modify(filterQuery: FilterQuery<Purchase_Order>, data: Partial<Purchase_Order>): Promise<PurchaseOrderDocument> {
    return await this.purchaseOrderModel.findOneAndUpdate(filterQuery, data, { new: true });
  }

  async remove(filterQuery: FilterQuery<Purchase_Order>): Promise<PurchaseOrderDocument> {
    return await this.purchaseOrderModel.findOneAndDelete(filterQuery);
  }
}
