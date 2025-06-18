import { Injectable } from '@nestjs/common';
import { Document, Types, FilterQuery, FlattenMaps } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { IPaging } from 'src/shared/interface/paging.interface';
import { ProductCategory, ProductCategoryDocument } from 'src/shared/schema/product-category.schema';

export class ProductCategoryService implements IBasicService<ProductCategory> {
  constructor(
    @InjectModel(ProductCategory.name) private readonly productCategoryModel: Model<ProductCategory>,
  ) {}

  async create(data: ProductCategory): Promise<ProductCategoryDocument> {
    const productCategory = new this.productCategoryModel(data);
    await productCategory.save();
    return productCategory;
  }

  async getAll(
    filterQuery: FilterQuery<ProductCategory>,
    page: number,
    size: number
  ): Promise<{ data: FlattenMaps<ProductCategory>[]; paging: IPaging }> {
    const countTotal = await this.productCategoryModel.countDocuments(filterQuery);
    const skip = (page - 1) * size;
    const data = await this.productCategoryModel.find(filterQuery).skip(skip).limit(size).lean();

    const paging: IPaging = {
      totalItems: countTotal,
      page,
      size,
      totalPages: Math.ceil(countTotal / size)
    };
    return { data, paging };
  }

  async getDetail(
    filterQuery: FilterQuery<ProductCategory>
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOne(filterQuery);;
  }

  async replace(
    filterQuery: FilterQuery<ProductCategory>,
    data: ProductCategory
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOneAndReplace(filterQuery, data, { new: true });
  }

  async modify(
    filterQuery: FilterQuery<ProductCategory>,
    data: Partial<ProductCategory>
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOneAndUpdate(filterQuery, data, { new: true });
  }

  async remove(
    filterQuery: FilterQuery<ProductCategory>
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOneAndDelete(filterQuery);
  }
}

