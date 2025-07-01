import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IProductCategory } from "../interface/product.interface";
import { HydratedDocument, Types } from "mongoose";
import { ObjectId } from 'mongodb';

import { VietnameseAccentUtil } from "../util/vietnamese-accent.util";

export type ProductCategoryDocument = HydratedDocument<Product_Category>;

@Schema({ timestamps: true })
export class Product_Category implements IProductCategory {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  slug: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: Product_Category.name, required: false })
  parentId?: string | Types.ObjectId;

  constructor(data: IProductCategory) {
    this.name = data.name;
    this.slug = this.generateSlug();
    this.description = data.description;
  }

  private generateSlug(): string {
    const nonAaccentVName = VietnameseAccentUtil.toNonAccentVietnamese(this.name);
    const slug = VietnameseAccentUtil.replaceSpaceToDash(nonAaccentVName);
    return slug;
  }

  set updateParentId(parentId: string) {
    this.parentId =  parentId ? ObjectId.createFromHexString(parentId.toString()) : null;
  }
}

export const productCategorySchema = SchemaFactory.createForClass(Product_Category);