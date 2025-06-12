import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IProduct } from '../../../shared/interface/product.interface';
import { Album } from 'src/module/album/schema/album.schema';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product implements IProduct {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true, unique: true, immutable: true })
  code: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Boolean, required: true })
  availability: boolean;
  
  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Album.name })
  albumId: Types.ObjectId | string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  usageInstructions: string;

  @Prop({ type: String })
  brand?: string;

  @Prop({ type: Number })
  rating?: number;

  @Prop({ type: Number })
  reviews?: number;

  constructor(product: IProduct) {
    this.name = product.name;
    this.code = this.generateProductCode();
    this.price = product.price;
    this.availability = product.availability;
    this.unit = product.unit;
    this.description = product.description;
    this.usageInstructions = product.usageInstructions;
    this.brand = product.brand;
    this.rating = product.rating;
    this.reviews = product.reviews;
  }

  private generateProductCode(): string {
    const prefix = 'PRD';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Lấy ngày hiện tại và chuyển định dạng thành 'yyyymmdd'
    const randomNumber = uuidv4().split('-')[0];; // Phần đầu của UUID
    const productCode = `${prefix}${date}${randomNumber}`; // 'PRD20231015123e4567'
    return productCode;
  }

  set updateAlbumId(albumId: string) {
    this.albumId = ObjectId.createFromHexString(albumId);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);