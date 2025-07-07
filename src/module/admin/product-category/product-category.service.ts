import { Injectable } from '@nestjs/common';
import { Document, Types, FilterQuery, FlattenMaps } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { IPaging } from 'src/shared/interface/paging.interface';
import { Product_Category, ProductCategoryDocument } from 'src/shared/schema/product-category.schema';
import { CustomBadRequestException, CustomInternalServerErrorException } from 'src/shared/core/exception/custom-exception';
import { Album } from '../../../shared/schema/album.schema';
import { Product } from 'src/shared/schema/product.schema';

export class ProductCategoryService implements IBasicService<Product_Category> {
  constructor(
    @InjectModel(Product_Category.name) private readonly productCategoryModel: Model<Product_Category>,
  ) { }

  async create(data: Product_Category): Promise<ProductCategoryDocument> {
    // Validate circular reference nếu có parentId
    if (data.parentId) {
      const isValid = await this.validateParentId(null, data.parentId.toString());
      if (!isValid) {
        throw new CustomBadRequestException('Đã phát hiện danh mục cha mẹ hoặc tham chiếu vòng tròn không hợp lệ');
      }
    }

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
    const data = await this.productCategoryModel.aggregate([
      {
        $match: filterQuery
      },
      {
        $lookup: {
          from: Album.name.toLocaleLowerCase(), // Tên collection của album trong MongoDB
          localField: 'albumId',
          foreignField: '_id',
          as: 'album'
        }
      },
      {
        $unwind: {
          path: '$album',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          description: 0, // Loại bỏ trường description,
          'album.media': 0 // Loại bỏ trường media trong album
        }
      },
      {
        $skip: skip
      },
      {
        $limit: size
      }
    ]);

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
    const [data] = await this.productCategoryModel.aggregate([
      {
        $match: filterQuery
      },
      {
        $lookup: {
          from: Album.name.toLocaleLowerCase(), // Tên collection của album trong MongoDB
          localField: 'albumId',
          foreignField: '_id',
          as: 'album'
        }
      },
      {
        $lookup: {
          from: Product_Category.name.toLowerCase(), // Tự lookup vào chính collection này
          localField: 'parentId',
          foreignField: '_id',
          as: 'parent'
        }
      },
      // Lookup để lấy danh sách sản phẩm liên quan
      {
        $lookup: {
          from: Product.name.toLocaleLowerCase(), // Tên collection của Product trong MongoDB
          localField: '_id',
          foreignField: 'productCategoryId', // Hoặc tên field tương ứng trong Product schema
          as: 'products'
        }
      },
      {
        $unwind: {
          path: '$album',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$parent',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $project: {
          products: 0
        }
      }
    ]);

    return data;
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
    // Validate circular reference nếu có parentId trong data update
    if (data.parentId) {
      const currentCategory = await this.productCategoryModel.findOne(filterQuery);
      if (!currentCategory) {
        throw new CustomBadRequestException('Danh mục không tồn tại');
      }

      const isValid = await this.validateParentId(currentCategory._id.toString(), data.parentId.toString());
      if (!isValid) {
        throw new CustomBadRequestException('Không thể cập nhật danh mục với parentId không hợp lệ hoặc tham chiếu vòng tròn');
      }
    }
    try {
      return await this.productCategoryModel.findOneAndUpdate(filterQuery, data, { new: true });
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomBadRequestException('Tên danh mục đã tồn tại, vui lòng chọn tên khác');
      }
      throw new CustomInternalServerErrorException('Lỗi khi cập nhật danh mục sản phẩm');
    }
  }

  async remove(
    filterQuery: FilterQuery<Product_Category>
  ): Promise<ProductCategoryDocument> {
    return await this.productCategoryModel.findOneAndDelete(filterQuery);
  }

  // --------------------------------

  // Validation methods
  private async validateParentId(categoryId: string | null, parentId: string): Promise<boolean> {
    // Kiểm tra parent category có tồn tại không
    const parentExists = await this.productCategoryModel.exists({ _id: parentId });
    if (!parentExists) {
      return false;
    }

    // Nếu đang update category (có categoryId)
    if (categoryId) {
      // Không thể set parent là chính nó
      if (categoryId === parentId) {
        return false;
      }

      // Kiểm tra circular reference
      const hasCircular = await this.checkCircularReference(categoryId, parentId);
      if (hasCircular) {
        return false;
      }
    }

    return true;
  }

  private async checkCircularReference(categoryId: string, parentId: string): Promise<boolean> {
    const visited = new Set<string>();
    let currentId = parentId;

    while (currentId) {
      // Nếu gặp lại category ban đầu -> có vòng lặp
      if (currentId === categoryId) {
        return true;
      }

      // Nếu đã visit -> có vòng lặp
      if (visited.has(currentId)) {
        return true;
      }

      visited.add(currentId);

      // Tìm parent tiếp theo
      const parent = await this.productCategoryModel.findById(currentId);
      currentId = parent?.parentId?.toString();
    }

    return false; // Không có circular reference
  }

  // Helper method để lấy category tree
  async getCategoryTree(): Promise<any[]> {
    const allCategories = await this.productCategoryModel.find({}).lean();
    return this.buildTree(allCategories, null);
  }

  private buildTree(categories: any[], parentId: any): any[] {
    const tree = [];

    for (const category of categories) {
      if ((parentId === null && !category.parentId) ||
        (category.parentId && category.parentId.toString() === parentId?.toString())) {
        const children = this.buildTree(categories, category._id);
        tree.push({
          ...category,
          children: children.length > 0 ? children : undefined
        });
      }
    }

    return tree;
  }
}

