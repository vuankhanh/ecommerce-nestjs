import { IDelivery } from "../interface/delivery.interface";

export class AddressUtil {
  static addressDetail(delivery: IDelivery): string {
    if (!delivery || !delivery.address) {
      return '';
    }
    const { street, ward, district, province } = delivery.address;
    return `${street}, ${ward ? ward.name + ', ' : ''}${district ? district.name + ', ' : ''}${province ? province.name : ''}`.trim();
  }
}
