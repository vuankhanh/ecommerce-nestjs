import { IDistrict, IProvince, IWard } from "./vn-public-apis.interface";

export interface IAddress {
  province: IProvince; // Province name
  district: IDistrict; // District name
  ward: IWard; // Ward name
  street: string; // Street address
}