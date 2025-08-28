import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Delivery, DeliveryDocument } from './schema/delivery.schema';
import { Document, Types, FilterQuery, FlattenMaps, Model, HydratedDocument } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { is } from 'cheerio/dist/commonjs/api/traversing';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { TLanguage } from 'src/shared/interface/lang.interface';

@Injectable()
export class AddressService implements IBasicService<Delivery> {
  constructor(
    // Inject the Mongoose model for Delivery if needed
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
  ) { }

  async create(data: Delivery): Promise<HydratedDocument<Delivery>> {
    const existingCount = await this.deliveryModel.countDocuments({
      accountId: data.accountId
    });

    if (existingCount === 0) {
      data.isDefault = true;
    }

    const delivery = new this.deliveryModel(data);
    await delivery.save();
    return delivery;
  }

  async getAll(filterQuery: FilterQuery<Delivery>, lang: TLanguage, page: number, size: number): Promise<{ data: FlattenMaps<Delivery>[]; paging: IPaging; }> {
    const countTotal = await this.deliveryModel.countDocuments(filterQuery);

    const deliveryAggregate = await this.deliveryModel.aggregate([
      { $match: filterQuery },
      {
        $project: {
          'address': 0,
        }
      },
      { $skip: size * (page - 1) },
      { $limit: size },
    ]);

    const metaData = {
      data: deliveryAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    return metaData;
  }

  getDetail(filterQuery: FilterQuery<Delivery>, lang: TLanguage): Promise<DeliveryDocument> {
    return this.deliveryModel.findOne(filterQuery);
  }

  replace(filterQuery: FilterQuery<Delivery>, data: Delivery): Promise<DeliveryDocument> {
    throw new Error('Method not implemented.');
  }

  modify(filterQuery: FilterQuery<Delivery>, data: Partial<Delivery>): Promise<DeliveryDocument> {
    return this.deliveryModel.findOneAndUpdate(filterQuery, data, { new: true });
  }

  async setDefaultAddress(accountId: string, deliveryId: string) {
    // Bỏ default của tất cả địa chỉ khác
    await this.deliveryModel.updateMany(
      { accountId: new Types.ObjectId(accountId) },
      { isDefault: false }
    );

    // Set địa chỉ mới làm default
    return this.deliveryModel.updateOne(
      {
        _id: new Types.ObjectId(deliveryId),
        accountId: new Types.ObjectId(accountId)
      },
      { isDefault: true }
    );
  }

  async remove(filterQuery: FilterQuery<Delivery>): Promise<DeliveryDocument> {
    const address = await this.deliveryModel.findOne(filterQuery, 'isDefault');
    const isDefaultAddress = address?.isDefault ?? false;
    if (isDefaultAddress) {
      throw new CustomBadRequestException('Không thể xóa địa chỉ không phải là mặc định');
    }

    return await this.deliveryModel.findOneAndDelete(filterQuery);
  }

}
