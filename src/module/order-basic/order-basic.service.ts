import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Types } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { Template } from 'src/shared/interface/template.interface';
import { OrderFrom, OrderStatus, OrderStatusTransition } from 'src/constant/order.constant';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Account } from 'src/module/auth/schemas/account.schema';
import { Order, OrderDocument } from './schema/order.schema';
import { UserRole } from 'src/constant/user.constant';
import { CustomBadRequestException, CustomNotFoundException } from 'src/shared/core/exception/custom-exception';
import { TOrderStatus } from 'src/shared/interface/order.interface';
import { IOrderPopulated } from 'src/shared/interface/order-response.interface';

@Injectable()
export class OrderBasicService implements IBasicService<IOrderPopulated> {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<IOrderPopulated>,
    private configService: ConfigService
  ) { }

  async create(data: Order): Promise<HydratedDocument<IOrderPopulated>> {
    const order = new this.orderModel(data);
    await order.save();
    return order;
  }

  async getAll(filterQuery: FilterQuery<Order>, lang: string, page: number, size: number): Promise<{ data: OrderDocument[]; paging: IPaging; }> {
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
            orderFrom: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$customerDetail.role", UserRole.CLIENT] },
                    then: OrderFrom.LOYALTY
                  },
                  {
                    case: { $eq: ["$customerDetail.role", UserRole.ADMIN] },
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
            customerDetail: 0
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

  async getDetail(filterQuery: FilterQuery<Order>, lang: string): Promise<OrderDocument> {
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

  async modifyStatus(filterQuery: FilterQuery<Order>, newStatus: TOrderStatus, cancelReason?: string): Promise<IOrderPopulated> {
    const order = await this.orderModel.findOne(filterQuery);
    if (!order) throw new CustomNotFoundException('Đơn hàng không tồn tại');
    const currentStatus = order.status;
    const allowedTransitions = OrderStatusTransition[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      throw new CustomBadRequestException(
        `Không thể chuyển trạng thái từ ${currentStatus} sang ${newStatus}`,
      );
    }

    const data: Partial<OrderDocument> = {
      status: newStatus,
    };

    if (newStatus === OrderStatus.CANCELED) {
      if (!cancelReason) {
        throw new CustomBadRequestException('Lý do hủy đơn hàng là bắt buộc khi chuyển sang trạng thái Đã hủy');
      }
      data.reasonForCancellation = cancelReason;
    }

    await this.orderModel.findOneAndUpdate(filterQuery, data, { new: true });
    return await this.tranformToDetaiData(filterQuery);
  }

  async updateOrder(filterQuery: FilterQuery<Order>, updateOrder: Partial<Order>): Promise<IOrderPopulated> {

    await this.orderModel.findOneAndUpdate(filterQuery, updateOrder, { new: true });
    return await this.tranformToDetaiData(filterQuery);
  }

  async modify(filterQuery: FilterQuery<Order>, data: Partial<Order>): Promise<OrderDocument> {
    return;
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
            localField: 'accountId',
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
            orderFrom: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$customerDetail.role", UserRole.CLIENT] },
                    then: OrderFrom.LOYALTY
                  },
                  {
                    case: { $eq: ["$customerDetail.role", UserRole.ADMIN] },
                    then: OrderFrom.ADMIN
                  }
                ],
                default: OrderFrom.VISITOR
              }
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
      ]
    ).then((data) => data[0]);
  }
}
