import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Customer, CustomerDocument } from './schema/customer.schema';
import { Document, Types, FlattenMaps, FilterQuery, Model } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CustomerService implements IBasicService<Customer> {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) { }

  async create(data: Customer): Promise<CustomerDocument> {
    const customer = new this.customerModel(data);
    await customer.save();
    return customer;
  }

  async insertMany(data: Customer[]): Promise<CustomerDocument[]> {
    return await this.customerModel.insertMany(data);
  }

  async getAll(filterQuery: FilterQuery<Customer>, page: number, size: number): Promise<{ data: FlattenMaps<Customer>[]; paging: IPaging; }> {
    const countTotal = await this.customerModel.countDocuments(filterQuery);
    const customerAggregate = await this.customerModel.aggregate(
      [
        { $match: filterQuery },
        {
          $project: {
            name: 1,
            phoneNumber: 1
          }
        },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: customerAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    
    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Customer>): Promise<CustomerDocument> {
    return await this.customerModel.findOne(filterQuery);
  }

  async replace(filterQuery: FilterQuery<Customer>, data: Customer): Promise<CustomerDocument> {
    return await this.customerModel.findOneAndReplace(filterQuery, data);
  }

  async modify(filterQuery: FilterQuery<Customer>, data: Partial<Customer>): Promise<CustomerDocument> {
    return await this.customerModel.findOneAndUpdate(filterQuery, data, { new: true });
  }

  async remove(filterQuery: FilterQuery<Customer>): Promise<CustomerDocument> {
    return await this.customerModel.findOneAndDelete(filterQuery);
  }

}
