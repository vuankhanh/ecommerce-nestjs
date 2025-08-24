import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IProduct, IProductReview } from '../interface/product.interface';

import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { Product_Category } from './product-category.schema';
import { Album } from 'src/shared/schema/album.schema';
import { VietnameseAccentUtil } from '../util/vietnamese-accent.util';
import { IMongodbDocument } from '../interface/mongo.interface';

export type ProductDocument = Product & IMongodbDocument;

@Schema({ timestamps: true })
export class Product implements IProduct {
  @Prop({
    type: Object,
    unique: true,
    required: true,
    validate: {
      validator: (name: any) => name && typeof name.vi === 'string' && name.vi.length > 0,
      message: 'Trường này phải có giá trị cho ngôn ngữ mặc định (vi)'
    }
  })
  name: { [lang: string]: string };;

  @Prop({
    type: String,
    unique: true,
    required: true,
    trim: true,
  })
  slug: string;

  @Prop({
    type: String,
    required: true
  })
  code: string;

  @Prop({
    type: Types.ObjectId,
    ref: Product_Category.name,
  })
  productCategoryId?: Types.ObjectId | string;

  productCategory?: Product_Category;

  @Prop({
    type: Object,
    required: true,
    validate: {
      validator: (desc: any) => desc && typeof desc.vi === 'string' && desc.vi.length > 0,
      message: 'Description phải có trường vi (ngôn ngữ mặc định)'
    }
  })
  description: { [lang: string]: string };

  @Prop({
    type: Object,
    required: true,
    validate: {
      validator: (desc: any) => desc && typeof desc.vi === 'string' && desc.vi.length > 0,
      message: 'ShortDescription phải có trường vi (ngôn ngữ mặc định)'
    }
  })
  shortDescription: { [lang: string]: string };

  @Prop({ type: Types.ObjectId, ref: Album.name })
  albumId?: Types.ObjectId | string;

  album?: Album;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Boolean, required: true })
  inStock: boolean;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop()
  metaTitle?: string;

  @Prop()
  metaDescription?: string;

  @Prop({ type: [String], default: [] })
  metaKeywords?: string[];

  @Prop({
    type: [
      {
        userId: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
      },
    ],
    default: [],
  })
  reviews?: IProductReview[];

  @Prop({ type: Number, default: 0 })
  averageRating?: number;

  @Prop({ type: Number, default: 0 })
  totalReviews?: number;

  constructor(product: IProduct) {
    this.name = product.name;
    this.slug = this.generateSlug();
    this.code = this.generateProductCode();
    this.price = product.price;
    this.inStock = product.inStock;
    this.description = product.description;
    this.shortDescription = product.shortDescription;
    this.reviews = product.reviews || [];
    this.averageRating = product.averageRating || 0;
    this.totalReviews = product.totalReviews || 0;
  }

  private generateSlug(): string {
    const nonAaccentVName = VietnameseAccentUtil.toNonAccentVietnamese(this.name.vi);
    const slug = VietnameseAccentUtil.replaceSpaceToDash(nonAaccentVName);
    return slug;
  }

  private generateProductCode(): string {
    const prefix = 'PRD';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Lấy ngày hiện tại và chuyển định dạng thành 'yyyymmdd'
    const randomNumber = uuidv4().split('-')[0];; // Phần đầu của UUID
    const productCode = `${prefix}${date}${randomNumber}`; // 'PRD20231015123e4567'
    return productCode;
  }

  set updateAlbumId(albumId: string) {
    this.albumId = albumId ? ObjectId.createFromHexString(albumId.toString()) : null;;
  }

  set updateProductCategoryId(productCategoryId: string) {
    this.productCategoryId = productCategoryId ? ObjectId.createFromHexString(productCategoryId.toString()) : null;
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);