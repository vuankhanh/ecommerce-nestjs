import { Types } from "mongoose";
import { IAddress } from "src/shared/interface/address.interface";
import { IDelivery } from "src/shared/interface/delivery.interface";

export class DeliveryEntity implements IDelivery {
  accountId: Types.ObjectId;
  name: string;
  phoneNumber: string;
  address: IAddress;
  addressDetail: string;

  constructor(accountId: string, name: string, phoneNumber: string, address: IAddress) {
    this.accountId = new Types.ObjectId(accountId);
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.addressDetail = DeliveryEntity.generateAddressDetail(this.address);
  }

  static generateAddressDetail(address: IAddress): string {
    return `${address.street}, ${address.ward.name}, ${address.district.name}, ${address.province.name}`;
  }

  toPlainObject() {
    return {
      accountId: this.accountId,
      name: this.name,
      phoneNumber: this.phoneNumber,
      address: this.address,
      addressDetail: this.addressDetail,
    };
  }
}