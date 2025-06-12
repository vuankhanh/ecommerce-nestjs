import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Supplier_Product, SupplierProductDocument } from './schema/supplier_product.schema';
import { FilterQuery, Model } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CustomConflictException } from 'src/shared/exception/custom-exception';
import { Supplier_Location } from '../supplier_location/schema/supplier_location.schema';

@Injectable()
export class SupplierProductService implements IBasicService<Supplier_Product> {
  constructor(
    @InjectModel(Supplier_Product.name) private supplierProductModel: Model<Supplier_Product>
  ) { }

  async create(data: Supplier_Product): Promise<SupplierProductDocument> {
    try {
      const supplierProduct = new this.supplierProductModel(data);

      return await supplierProduct.save();
    } catch (error) {
      if (error.code === 11000) {
        // Lỗi trùng lặp (duplicate key)
        throw new CustomConflictException('Supplier product name đã tồn tại');
      }
      throw new Error(error);
    }
  }

  async getAll(filterQuery: FilterQuery<Supplier_Product>, page: number, size: number): Promise<{ data: SupplierProductDocument[]; paging: IPaging; }> {
    const countTotal = await this.supplierProductModel.countDocuments(filterQuery);
    const supplierProductAggregate = await this.supplierProductModel.aggregate(
      [
        { $match: filterQuery },
        { $skip: size * (page - 1) },
        { $limit: size },
        {
          $lookup: {
            from: Supplier_Location.name.toLocaleLowerCase(), // Tên collection của Supplier_Location
            localField: 'supplierLocationId', // Trường trong Supplier_Product
            foreignField: '_id', // Trường trong Supplier_Location
            as: 'supplierLocation', // Tên trường sau khi populate
          },
        },
        { $unwind: { path: '$supplierLocation', preserveNullAndEmptyArrays: true } }, // Giải nén mảng (nếu cần)
        {
          $addFields: {
            supplierLocationDebt: '$supplierLocation.debt', // Lấy trường debt từ supplierLocation
          },
        },
        { $project: { supplierLocation: 0 } }, // Loại bỏ trường supplierLocation
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

  async getDetail(filterQuery: FilterQuery<Supplier_Product>): Promise<SupplierProductDocument> {
    return await this.supplierProductModel.findOne(filterQuery);
  }

  async replace(filterQuery: FilterQuery<Supplier_Product>, data: Supplier_Product): Promise<SupplierProductDocument> {
    return await this.supplierProductModel.findOneAndReplace(filterQuery, data);
  }

  async modify(filterQuery: FilterQuery<Supplier_Product>, data: Partial<Supplier_Product>): Promise<SupplierProductDocument> {
    return await this.supplierProductModel.findOneAndUpdate(filterQuery, data, { new: true });
  }

  async remove(filterQuery: FilterQuery<Supplier_Product>): Promise<SupplierProductDocument> {
    return await this.supplierProductModel.findOneAndDelete(filterQuery);
  }
}
