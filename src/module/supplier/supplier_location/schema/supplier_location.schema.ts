import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IAddress } from "src/shared/interface/address.interface";
import { ICoordinates } from "src/shared/interface/coordinates.interface";
import { ISupplierDebt, ISupplierLocation } from "src/shared/interface/supplier_location.interface";
import { SupplierLocationDto } from "../dto/supplier_location.dto";

export type SupplierLocationDocument = HydratedDocument<Supplier_Location>;

@Schema({ timestamps: true })
export class Supplier_Location implements ISupplierLocation {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Object })
  address: IAddress;

  @Prop({ type: String })
  telephone: string;

  @Prop({ type: Object })
  debt: ISupplierDebt;

  @Prop({
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false,
  })
  email?: string;

  @Prop({ type: Object })
  position?: ICoordinates;

  constructor(supplierLocationDto: SupplierLocationDto){
    this.name = supplierLocationDto.name;
    this.address = supplierLocationDto.address;
    this.telephone = supplierLocationDto.telephone;
    this.debt = supplierLocationDto.debt ? supplierLocationDto.debt : {
      amount: 0,
      note: ''
    };
    this.email = supplierLocationDto.email;
    this.position = supplierLocationDto.position;
  }
}

export const supplierLocationSchema = SchemaFactory.createForClass(Supplier_Location);