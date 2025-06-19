import { Injectable } from '@nestjs/common';
import { Document, Types, FilterQuery, FlattenMaps } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { IPaging } from 'src/shared/interface/paging.interface';
import { Product_Category, ProductCategoryDocument } from 'src/shared/schema/product-category.schema';

export class ProductCategoryService implements IBasicService<Product_Category> {
  constructor(
    @InjectModel(Product_Category.name) private readonly productCategoryModel: Model<Product_Category>,
  ) {}

  async create(data: Product_Category): Promise<ProductCategoryDocument> {
    const productCategory = new this.productCategoryModel(data);
    await productCategory.save();
    return productCategory;
  }

  async getAll(
    filterQuery: FilterQuery<Product_Category>,
    page: number,
    size: number
  ): Promise<{ data: FlattenMaps<Product_Category>[]; paging: IPaging }> {
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
    filterQuery: FilterQuery<Product_Category>
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOne(filterQuery);;
  }

  async replace(
    filterQuery: FilterQuery<Product_Category>,
    data: Product_Category
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOneAndReplace(filterQuery, data, { new: true });
  }

  async modify(
    filterQuery: FilterQuery<Product_Category>,
    data: Partial<Product_Category>
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOneAndUpdate(filterQuery, data, { new: true });
  }

  async remove(
    filterQuery: FilterQuery<Product_Category>
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOneAndDelete(filterQuery);
  }
}

