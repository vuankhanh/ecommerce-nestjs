import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { Template } from 'src/shared/interface/template.interface';
import { OrderFrom, OrderStatus } from 'src/constant/order.constant';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Account } from 'src/module/auth/schemas/account.schema';
import { Order, OrderDocument } from './schema/order.schema';
import { UserRole } from 'src/constant/user.constant';

@Injectable()
export class OrderBasicService implements IBasicService<Order> {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private configService: ConfigService
  ) { }

  async create(data: Order): Promise<OrderDocument> {
    const order = new this.orderModel(data);
    await order.save();
    return order;
  }

  async getAll(filterQuery: FilterQuery<Order>, page: number, size: number): Promise<{ data: OrderDocument[]; paging: IPaging; }> {
    const countTotal = await this.orderModel.countDocuments(filterQuery);
    const orderAggregate = await this.orderModel.aggregate(
      [
        { $match: filterQuery },
        {
          $sort: { createdAt: -1 } // Sắp xếp theo ngày tạo mới nhất
        },
        {
          $lookup: {
            from: Account.name.toLocaleLowerCase(), // Tên của collection Customer
            localField: 'accountId',
            foreignField: '_id',
            as: 'orderAccount'
          }
        },
        {
          $unwind: {
            path: '$orderAccount',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        },
        {
          $addFields: {
            orderFrom: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$orderAccount.role", UserRole.CLIENT] },
                    then: OrderFrom.LOYALTY
                  },
                  {
                    case: { $eq: ["$orderAccount.role", UserRole.ADMIN] },
                    then: OrderFrom.ADMIN
                  }
                ],
                default: OrderFrom.VISITOR
              }
            },
            'productName': {
              $ifNull: [
                { $arrayElemAt: ["$orderItems.productName", 0] }, null
              ]
            },
            'productThumbnail': {
              $ifNull: [
                { $arrayElemAt: ["$orderItems.productThumbnail", 0] }, null
              ]
            },
            'productQuantity': {
              $ifNull: [
                { $sum: "$orderItems.quantity" }, 0
              ]
            },
            'subTotal': {
              $ifNull: [
                {
                  $sum: {
                    $map: {
                      input: "$orderItems",
                      as: "item",
                      in: { $multiply: ["$$item.price", "$$item.quantity"] }
                    }
                  }
                },
                0
              ]
            }
          }
        },
        { $skip: size * (page - 1) },
        { $limit: size },
        {
          $project: {
            orderItems: {
              _id: 0
            },
            note: 0,
            __v: 0,
            accountId: 0,
            orderAccount: 0
            // orderAccount: {
            //   _id: 0,
            //   createdAt: 0,
            //   updatedAt: 0,
            //   facebookId: 0,
            //   googleId: 0,
            //   role: 0,
            //   createdByProvider: 0,
            //   hasPassword: 0,
            //   password: 0,
            //   __v: 0
            // }
          }
        }
      ]
    );

    const metaData = {
      data: orderAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Order>): Promise<OrderDocument> {
    return await this.tranformToDetaiData(filterQuery);
  }

  async findById(id: string): Promise<OrderDocument> {
    return await this.orderModel.findById(id);
  }

  async replace(filterQuery: FilterQuery<Order>, data: Order): Promise<OrderDocument> {
    await this.orderModel.findOneAndReplace(filterQuery, data);
    const product = await this.tranformToDetaiData(filterQuery);
    return product;
  }

  async modify(filterQuery: FilterQuery<Order>, data: Partial<Order>): Promise<OrderDocument> {
    await this.orderModel.findOneAndUpdate(filterQuery, data, { new: true });
    const product = await this.tranformToDetaiData(filterQuery);
    return product;
  }

  async print(temp: Template) {
    // return this.PrinterService.print(temp);
    const protocol = this.configService.get('printer.protocol');
    const host = this.configService.get('printer.host');
    const port = this.configService.get('printer.port');

    const url = `${protocol}://${host}:${port}/api/print`;

    return await axios.post(url, temp).then(res => res.data);
  }

  async remove(filterQuery: FilterQuery<Order>): Promise<OrderDocument> {
    return null
  }

  private async tranformToDetaiData(filterQuery: FilterQuery<Order>): Promise<OrderDocument> {
    return await this.orderModel.aggregate(
      [
        { $match: filterQuery },
        {
          $lookup: {
            from: Account.name.toLowerCase(), // Tên của collection Customer
            localField: 'customerId',
            foreignField: '_id',
            as: 'customerDetail'
          }
        },
        {
          $unwind: {
            path: '$customerDetail',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        },
        {
          $addFields: {
            'subTotal': {
              $ifNull: [
                {
                  $sum: {
                    $map: {
                      input: "$orderItems",
                      as: "item",
                      in: { $multiply: ["$$item.price", "$$item.quantity"] }
                    }
                  }
                },
                0
              ]
            }
          }
        },
      ]
    ).then((data) => data[0]);
  }
}
