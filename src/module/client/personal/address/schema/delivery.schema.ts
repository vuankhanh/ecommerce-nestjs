import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { validatePhoneNumber } from "src/shared/custom-validator/vietnamese-phone-number.validator";
import { IAddress } from "src/shared/interface/address.interface";
import { IDelivery } from "src/shared/interface/delivery.interface";

export type DeliveryDocument = HydratedDocument<Delivery>;

@Schema({
  timestamps: true
})
export class Delivery implements IDelivery {
  @Prop({ type: String, required: true })
  accountId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true, pattern: validatePhoneNumber })
  phoneNumber: string;

  @Prop({ type: Object, required: true })
  address: IAddress;
  
  @Prop({ type: String, required: true })
  addressDetail: string;

  constructor(name: string, phoneNumber: string, address: IAddress) {
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.addressDetail = this.getAddressDetail;
  }

  private get getAddressDetail(): string {
    return `${this.address.street}, ${this.address.ward.name}, ${this.address.district.name}, ${this.address.province.name}`;
  }
}

export const delivertySchema = SchemaFactory.createForClass(Delivery);