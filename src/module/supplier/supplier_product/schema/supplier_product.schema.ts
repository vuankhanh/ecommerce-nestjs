import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ISupplierProduct } from "../../shared/interface/product.interface";
import { HydratedDocument, Types } from "mongoose";
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { SupplierProductUnit } from "src/constant/product.constant";
import { SupplierProductDto } from "../dto/supplier_product.dto";
import { Supplier_Location } from "../../supplier_location/schema/supplier_location.schema";

export type SupplierProductDocument = HydratedDocument<Supplier_Product>;

@Schema({ timestamps: true })
export class Supplier_Product implements ISupplierProduct {
  @Prop({ type: String, required: true, unique: true, immutable: true })
  code: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, enum: SupplierProductUnit, required: true })
  unit: `${SupplierProductUnit}`;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Types.ObjectId, required: true, ref: Supplier_Location.name })
  supplierLocationId: Types.ObjectId | string;

  @Prop({ type: String, required: true })
  supplierLocationName: string;

  constructor(
    supplierProduct: SupplierProductDto,
  ) {
    this.name = supplierProduct.name;
    this.code = this.generateSupplierProductCode();
    this.price = supplierProduct.price;
    this.unit = supplierProduct.unit;
    this.description = supplierProduct.description;
  }

  private generateSupplierProductCode(): string {
    const prefix = 'SUPRD';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Lấy ngày hiện tại và chuyển định dạng thành 'yyyymmdd'
    const randomNumber = uuidv4().split('-')[0];; // Phần đầu của UUID
    const productCode = `${prefix}${date}${randomNumber}`; // 'PRD20231015123e4567'
    return productCode;
  }

  set updateSupplierLocationId(supplierLocationId: string) {
    this.supplierLocationId = ObjectId.createFromHexString(supplierLocationId);
  }
}

export const supplierProductSchema = SchemaFactory.createForClass(Supplier_Product);