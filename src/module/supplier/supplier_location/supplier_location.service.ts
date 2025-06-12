import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Supplier_Location, SupplierLocationDocument } from './schema/supplier_location.schema';
import { Document, Types, FilterQuery, FlattenMaps } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomConflictException } from 'src/shared/exception/custom-exception';
import { ISupplierDebt } from 'src/shared/interface/supplier_location.interface';

@Injectable()
export class SupplierLocationService implements IBasicService<Supplier_Location> {
  constructor(
    @InjectModel(Supplier_Location.name) private supplierModel: Model<Supplier_Location>
  ) { }

  async create(supplierData: Supplier_Location): Promise<SupplierLocationDocument> {
    try {
      const supplier = new this.supplierModel(supplierData);
      return await supplier.save();
    } catch (error) {
      if (error.code === 11000) {
        // Lỗi trùng lặp (duplicate key)
        throw new CustomConflictException('Supplier name đã tồn tại');
      }
      return error;
    }
  }

  async getAll(filterQuery: FilterQuery<Supplier_Location>, page: number, size: number): Promise<{ data: SupplierLocationDocument[]; paging: IPaging; }> {
    const countTotal = await this.supplierModel.countDocuments(filterQuery);
    const supplierAggregate = await this.supplierModel.aggregate(
      [
        { $match: filterQuery },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: supplierAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };

    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Supplier_Location>): Promise<SupplierLocationDocument> {
    return await this.supplierModel.findOne(filterQuery);
  }

  async getDebt(filterQuery: FilterQuery<Supplier_Location>): Promise<ISupplierDebt> {
    const supplierDebt: ISupplierDebt = await this.supplierModel.findOne(filterQuery, { debt: 1 });
    return supplierDebt;
  }

  async replace(filterQuery: FilterQuery<Supplier_Location>, data: Supplier_Location): Promise<SupplierLocationDocument> {
    return await this.supplierModel.findOneAndReplace(filterQuery, data);
  }

  async modify(filterQuery: FilterQuery<Supplier_Location>, data: Partial<Supplier_Location>): Promise<SupplierLocationDocument> {
    return await this.supplierModel.findOneAndUpdate(filterQuery, data, { new: true });
  }

  async updateDebt(filterQuery: FilterQuery<Supplier_Location>, debt: ISupplierDebt): Promise<SupplierLocationDocument> {
    return await this.supplierModel.findOneAndUpdate(filterQuery, {
      $set: { debt }
    }, { new: true });
  }

  async remove(filterQuery: FilterQuery<Supplier_Location>): Promise<SupplierLocationDocument> {
    return await this.supplierModel.findOneAndDelete(filterQuery);
  }

}
