import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IProduct, IProductReview } from '../interface/product.interface';
import { Album } from 'src/module/album/schema/album.schema';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { ProductCategory } from './product-category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product implements IProduct {
  @Prop({
    type: String,
    required: true
  })
  name: string;

  @Prop({
    type: String,
    required: true
  })
  code: string;

  @Prop({ type: Types.ObjectId, ref: ProductCategory.name })
  productCategoryId?: Types.ObjectId | string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Album.name })
  albumId: Types.ObjectId | string;

  @Prop({ required: true })
  price: number;

  @Prop()
  salePrice?: number;

  @Prop({ required: true })
  category: string;

  @Prop()
  brand?: string;

  @Prop({ required: true })
  stock: number;

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
    this.code = this.generateProductCode();
    this.price = product.price;
    this.description = product.description;
    this.shortDescription = product.shortDescription;
    this.category = product.category;
    this.stock = product.stock;
    this.tags = product.tags || [];
    this.metaTitle = product.metaTitle;
    this.metaDescription = product.metaDescription;
    this.metaKeywords = product.metaKeywords || [];
    this.reviews = product.reviews || [];
    this.averageRating = product.averageRating || 0;
    this.totalReviews = product.totalReviews || 0;
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