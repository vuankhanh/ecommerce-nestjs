import { Injectable } from '@nestjs/common';
import { Document, Types, FilterQuery, FlattenMaps } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { IPaging } from 'src/shared/interface/paging.interface';
import { ProductCategory, ProductCategoryDocument } from 'src/shared/schema/product-category.schema';

export class ProductCategoryService implements IBasicService<ProductCategoryDocument> {
  constructor(
    @InjectModel(ProductCategory.name)
    private readonly productCategoryModel: Model<ProductCategoryDocument>,
  ) {}

  async create(
    data: Document<unknown, {}, ProductCategory, {}> &
      ProductCategory & { _id: Types.ObjectId } & { __v: number }
  ): Promise<
    Document<
      unknown,
      {},
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number },
      {}
    > &
      Document<unknown, {}, ProductCategory, {}> &
      ProductCategory & { _id: Types.ObjectId } & { __v: number } & Required<{ _id: Types.ObjectId }>
  > {
    const created = new this.productCategoryModel(data);
    return created.save();
  }

  async getAll(
    filterQuery: FilterQuery<
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number }
    >,
    page: number,
    size: number
  ): Promise<{
    data: FlattenMaps<
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number }
    >[];
    paging: IPaging;
  }> {
    const countTotal = await this.productCategoryModel.countDocuments(filterQuery);
    const skip = (page - 1) * size;
    const [data, total] = await Promise.all([
      this.productCategoryModel
        .find(filterQuery)
        .skip(skip)
        .limit(size)
        .lean()
        .exec(),
      this.productCategoryModel.countDocuments(filterQuery),
    ]);
    return {
      data: data as any,
      paging: {
        totalItems: countTotal,
        page,
        size,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  async getDetail(
    filterQuery: FilterQuery<
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number }
    >
  ): Promise<
    Document<
      unknown,
      {},
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number },
      {}
    > &
      Document<unknown, {}, ProductCategory, {}> &
      ProductCategory & { _id: Types.ObjectId } & { __v: number } & Required<{ _id: Types.ObjectId }>
  > {
    return this.productCategoryModel.findOne(filterQuery).exec();
  }

  async replace(
    filterQuery: FilterQuery<
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number }
    >,
    data: Document<unknown, {}, ProductCategory, {}> &
      ProductCategory & { _id: Types.ObjectId } & { __v: number }
  ): Promise<
    Document<
      unknown,
      {},
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number },
      {}
    > &
      Document<unknown, {}, ProductCategory, {}> &
      ProductCategory & { _id: Types.ObjectId } & { __v: number } & Required<{ _id: Types.ObjectId }>
  > {
    return this.productCategoryModel
      .findOneAndReplace(filterQuery, data, { new: true })
      .exec();
  }

  async modify(
    filterQuery: FilterQuery<
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number }
    >,
    data: Partial<
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number }
    >
  ): Promise<
    Document<
      unknown,
      {},
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number },
      {}
    > &
      Document<unknown, {}, ProductCategory, {}> &
      ProductCategory & { _id: Types.ObjectId } & { __v: number } & Required<{ _id: Types.ObjectId }>
  > {
    return this.productCategoryModel
      .findOneAndUpdate(filterQuery, data, { new: true })
      .exec();
  }

  async remove(
    filterQuery: FilterQuery<
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number }
    >
  ): Promise<
    Document<
      unknown,
      {},
      Document<unknown, {}, ProductCategory, {}> &
        ProductCategory & { _id: Types.ObjectId } & { __v: number },
      {}
    > &
      Document<unknown, {}, ProductCategory, {}> &
      ProductCategory & { _id: Types.ObjectId } & { __v: number } & Required<{ _id: Types.ObjectId }>
  > {
    return this.productCategoryModel.findOneAndDelete(filterQuery).exec();
  }
}

