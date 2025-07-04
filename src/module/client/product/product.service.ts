import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Product, ProductDocument } from '../../../shared/schema/product.schema';
import { FilterQuery, FlattenMaps, Model } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from '../../../shared/schema/album.schema';
import { Product_Category } from 'src/shared/schema/product-category.schema';
import { ProductCategoryService } from '../product-category/product-category.service';
import { CustomNotFoundException } from 'src/shared/core/exception/custom-exception';

@Injectable()
export class ProductService implements IBasicService<Product> {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly productCategoryService: ProductCategoryService
  ) { }

  async create(data: Product): Promise<ProductDocument> {
    const product = new this.productModel(data);
    await product.save();
    return product;
  }

  async getAll(filterQuery: FilterQuery<Product>, page: number, size: number): Promise<{ data: FlattenMaps<Product>[]; paging: IPaging; }> {
    const countTotal = await this.productModel.countDocuments(filterQuery);
    const productAggregate = await this.productModel.aggregate(
      [
        { $match: filterQuery },
        {
          $lookup: {
            from: Album.name.toLocaleLowerCase(), // Tên của bộ sưu tập Album
            localField: 'albumId',
            foreignField: '_id',
            as: 'album'
          }
        },
        {
          $unwind: {
            path: '$album',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        },
        {
          $lookup: {
            from: Product_Category.name.toLocaleLowerCase(), // Tên của bộ sưu tập Album
            localField: 'productCategoryId',
            foreignField: '_id',
            as: 'productCategory'
          }
        },
        {
          $unwind: {
            path: '$productCategory',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        },
        {
          $addFields: {
            'album.mediaItems': { $size: { $ifNull: ['$album.media', []] } }
          }
        },
        {
          $project: {
            'album.media': 0,
            'description': 0,
            'reviews': 0,
            'tags': 0,
            'totalReviews': 0,
            'metaKeywords': 0
          }
        },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: productAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };

    return metaData;
  }

  async getProductsByCategorySlug(categorySlug: string, page: number, size: number): Promise<{ data: FlattenMaps<Product>[]; paging: IPaging; }> {

    const productCategory = await this.productCategoryService.getDetail({ slug: categorySlug });
    if (!productCategory) {
      throw new CustomNotFoundException('Không tìm thấy danh mục sản phẩm');
    }

    const productCategoryId = productCategory._id;

    const filterQuery: FilterQuery<Product> = { productCategoryId };
    return this.getAll(filterQuery, page, size);
  }

  async getDetail(filterQuery: FilterQuery<Product>): Promise<ProductDocument> {
    return await this.tranformToDetaiData(filterQuery);
  }

  async replace(filterQuery: FilterQuery<Product>, data: Product): Promise<ProductDocument> {
    await this.productModel.findOneAndReplace(filterQuery, data);
    const product = await this.tranformToDetaiData(filterQuery);
    return product;
  }

  async modify(filterQuery: FilterQuery<Product>, data: Partial<Product>): Promise<ProductDocument> {
    await this.productModel.findOneAndUpdate(filterQuery, data, { new: true });
    const product = await this.tranformToDetaiData(filterQuery);
    return product;
  }

  async remove(filterQuery: FilterQuery<Product>): Promise<ProductDocument> {
    return await this.productModel.findOneAndDelete(filterQuery);
  }

  private async tranformToDetaiData(filterQuery: FilterQuery<Product>): Promise<ProductDocument> {
    return await this.productModel.aggregate(
      [
        { $match: filterQuery },
        {
          $lookup: {
            from: Album.name.toLocaleLowerCase(), // Tên của bộ sưu tập Album
            localField: 'albumId',
            foreignField: '_id',
            as: 'album'
          }
        },
        {
          $lookup: {
            from: Product_Category.name.toLocaleLowerCase(), // Tên của bộ sưu tập Album
            localField: 'productCategoryId',
            foreignField: '_id',
            as: 'productCategory'
          }
        },
        {
          $unwind: {
            path: '$album',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        },
        {
          $unwind: {
            path: '$productCategory',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        },
        {
          $addFields: {
            'album.mediaItems': { $size: { $ifNull: ['$albumDetail.media', []] } }
          }
        },
      ]
    ).then((data) => data[0]);
  }

}
