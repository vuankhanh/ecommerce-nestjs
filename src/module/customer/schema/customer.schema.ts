import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CustomerLevel } from "src/constant/customer.constant";
import { ICustomer, ICustomerLevel } from "src/shared/interface/customer.interface";
import { PhoneUtil } from "src/shared/util/phone.util";

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({
  timestamps: true
})
export class Customer implements ICustomer {
  @Prop({
    type: String,
    required: true
  })
  name: string;

  @Prop({
    type: String,
    required: true
  })
  phoneNumber: string;

  @Prop({
    type: String
  })
  address: string;

  @Prop({
    type: String
  })
  email?: string;

  @Prop({
    type: String
  })
  dob?: string;

  @Prop({
    type: String
  })
  company?: string;

  @Prop({
    type: String
  })
  note?: string;
  
  @Prop({
    type: String,
    enum: CustomerLevel,
    default: CustomerLevel.NORMAL
  })
  level?: ICustomerLevel;
  
  constructor(customer: ICustomer) {
    this.name = customer.name;
    this.phoneNumber = PhoneUtil.formatPhoneNumber(customer.phoneNumber);
    this.address = customer.address;
    this.email = customer.email;
    this.dob = customer.dob;
    this.company = customer.company;
    this.note = customer.note;
    this.level = customer.level;
  }
}

export const customerSchema = SchemaFactory.createForClass(Customer);