import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { Template } from 'src/shared/interface/template.interface';
import {
  OrderFrom,
  OrderStatus,
  OrderStatusTransition,
} from 'src/constant/order.constant';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Account } from 'src/module/auth/schemas/account.schema';
import {
  Order,
  OrderDocument,
  OrderPopulatedDocument,
  OrderDetailPopulatedDocument,
} from './schema/order.schema';
import { UserRole } from 'src/constant/user.constant';
import {
  CustomBadRequestException,
  CustomNotFoundException,
} from 'src/shared/core/exception/custom-exception';
import { TOrderStatus } from 'src/shared/interface/order.interface';
import { TLanguage } from 'src/shared/interface/lang.interface';

@Injectable()
export class OrderBasicService
  implements
    IBasicService<Order, OrderPopulatedDocument, OrderDetailPopulatedDocument>
{
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private configService: ConfigService,
  ) {}

  async create(data: Order): Promise<OrderDocument> {
    const order = await this.orderModel.create(data);
    return order;
  }

  async getAll(
    filterQuery: FilterQuery<Order>,
    lang: TLanguage,
    page: number,
    size: number,
  ): Promise<{ data: OrderPopulatedDocument[]; paging: IPaging }> {
    const countTotal = await this.orderModel.countDocuments(filterQuery);
    const orderAggregate = await this.orderModel.aggregate([
      { $match: filterQuery },
      {
        $sort: { createdAt: -1 }, // Sắp xếp theo ngày tạo mới nhất
      },
      {
        $lookup: {
          from: Account.name.toLocaleLowerCase(), // Tên của collection Customer
          localField: 'accountId',
          foreignField: '_id',
          as: 'customerDetail',
        },
      },
      {
        $unwind: {
          path: '$customerDetail',
          preserveNullAndEmptyArrays: true, // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
        },
      },
      {
        $addFields: {
          orderFrom: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$customerDetail.role', UserRole.CLIENT] },
                  then: OrderFrom.LOYALTY,
                },
                {
                  case: { $eq: ['$customerDetail.role', UserRole.ADMIN] },
                  then: OrderFrom.ADMIN,
                },
              ],
              default: OrderFrom.VISITOR,
            },
          },
          subTotal: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: '$orderItems',
                    as: 'item',
                    in: { $multiply: ['$$item.price', '$$item.quantity'] },
                  },
                },
              },
              0,
            ],
          },
        },
      },
      { $skip: size * (page - 1) },
      { $limit: size },
      {
        $project: {
          // orderItems: 0,
          note: 0,
          delivery: 0,
          __v: 0,
          accountId: 0,
          customerDetail: 0,
        },
      },
    ]);
    const metaData = {
      data: orderAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      },
    };
    return metaData;
  }

  async getRawData(filterQuery: FilterQuery<Order>): Promise<OrderDocument> {
    const order = await this.orderModel.findOne(filterQuery);

    if (!order) throw new CustomNotFoundException('Đơn hàng không tồn tại');
    return order;
  }

  async getDetail(
    filterQuery: FilterQuery<Order>,
    lang: TLanguage,
  ): Promise<OrderDetailPopulatedDocument> {
    return await this.tranformToDetaiData(filterQuery, lang);
  }

  async replace(
    filterQuery: FilterQuery<Order>,
    data: Order,
    lang: TLanguage,
  ): Promise<OrderDetailPopulatedDocument> {
    await this.orderModel.findOneAndReplace(filterQuery, data);
    const product = await this.tranformToDetaiData(filterQuery, lang);
    return product;
  }

  async modifyStatus(
    filterQuery: FilterQuery<Order>,
    lang: TLanguage,
    newStatus: TOrderStatus,
    cancelReason?: string,
  ): Promise<OrderDetailPopulatedDocument> {
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
        throw new CustomBadRequestException(
          'Lý do hủy đơn hàng là bắt buộc khi chuyển sang trạng thái Đã hủy',
        );
      }
      data.reasonForCancellation = cancelReason;
    }

    await this.orderModel.findOneAndUpdate(filterQuery, data, { new: true });
    return await this.tranformToDetaiData(filterQuery, lang);
  }

  async updateOrder(
    filterQuery: FilterQuery<Order>,
    lang: TLanguage,
    updateOrder: Partial<Order>,
  ): Promise<OrderDetailPopulatedDocument> {
    await this.orderModel.findOneAndUpdate(filterQuery, updateOrder, {
      new: true,
    });
    return await this.tranformToDetaiData(filterQuery, lang);
  }

  async modify(): Promise<OrderDetailPopulatedDocument> {
    return;
  }

  async print(temp: Template) {
    // return this.PrinterService.print(temp);
    const protocol = this.configService.get('printer.protocol');
    const host = this.configService.get('printer.host');
    const port = this.configService.get('printer.port');

    const url = `${protocol}://${host}:${port}/api/print`;

    return await axios.post(url, temp).then((res) => res.data);
  }

  async remove(
    filterQuery: FilterQuery<Order>,
  ): Promise<OrderDetailPopulatedDocument> {
    return null;
  }

  private async tranformToDetaiData(
    filterQuery: FilterQuery<Order>,
    lang?: TLanguage,
  ): Promise<OrderDetailPopulatedDocument> {
    return await this.orderModel
      .aggregate([
        { $match: filterQuery },
        {
          $lookup: {
            from: Account.name.toLowerCase(), // Tên của collection Customer
            localField: 'accountId',
            foreignField: '_id',
            as: 'customerDetail',
          },
        },
        {
          $unwind: {
            path: '$customerDetail',
            preserveNullAndEmptyArrays: true, // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          },
        },
        {
          $addFields: {
            customerEmail: { $ifNull: ['$customerDetail.email', null] },
            customerName: { $ifNull: ['$customerDetail.name', null] },
            orderFrom: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$customerDetail.role', UserRole.CLIENT] },
                    then: OrderFrom.LOYALTY,
                  },
                  {
                    case: { $eq: ['$customerDetail.role', UserRole.ADMIN] },
                    then: OrderFrom.ADMIN,
                  },
                ],
                default: OrderFrom.VISITOR,
              },
            },
            subTotal: {
              $ifNull: [
                {
                  $sum: {
                    $map: {
                      input: '$orderItems',
                      as: 'item',
                      in: { $multiply: ['$$item.price', '$$item.quantity'] },
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            __v: 0,
            accountId: 0,
            customerDetail: 0,
          },
        },
      ])
      .then((data) => data[0]);
  }
}
