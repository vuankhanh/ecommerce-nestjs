import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IProductCategory } from "../interface/product.interface";
import { HydratedDocument, Types } from "mongoose";
import { ObjectId } from 'mongodb';

import { VietnameseAccentUtil } from "../util/vietnamese-accent.util";
import { Album } from "src/shared/schema/album.schema";
import { IMongodbDocument } from "../interface/mongo.interface";
import { TLanguage } from "../interface/lang.interface";

export type ProductCategoryDocument = Product_Category & IMongodbDocument;

@Schema({ timestamps: true })
export class Product_Category implements IProductCategory {
  @Prop({
    type: Object,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (name: any) => name && typeof name.vi === 'string' && name.vi.length > 0,
      message: 'Trường name phải có giá trị cho ngôn ngữ mặc định (vi)'
    }
  })
  name: { [key in TLanguage]: string };

  @Prop({
    type: Types.ObjectId,
    ref: Album.name,
    required: false,
  })
  albumId?: Types.ObjectId | string; // ID của album chứa ảnh danh mục

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  slug: string;

  @Prop({
    type: Object,
    required: false,
    validate: {
      validator: (desc: any) => desc && typeof desc.vi === 'string' && desc.vi.length > 0,
      message: 'Trường description phải có giá trị cho ngôn ngữ mặc định (vi)'
    }
  })
  description?: { [key in TLanguage]: string };

  @Prop({ type: Types.ObjectId, ref: Product_Category.name, required: false })
  parentId?: string | Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  constructor(data: IProductCategory) {
    this.name = data.name;
    this.slug = this.generateSlug();
    this.description = data.description;
    this.isActive = data.isActive
  }

  private generateSlug(): string {
    const nonAaccentVName = VietnameseAccentUtil.toNonAccentVietnamese(this.name.vi);
    const slug = VietnameseAccentUtil.replaceSpaceToDash(nonAaccentVName);
    return slug;
  }

  set updatealbumId(albumId: string) {
    this.albumId = albumId ? ObjectId.createFromHexString(albumId.toString()) : null;
  }

  set updateParentId(parentId: string) {
    this.parentId = parentId ? ObjectId.createFromHexString(parentId.toString()) : null;
  }
}

export const productCategorySchema = SchemaFactory.createForClass(Product_Category);