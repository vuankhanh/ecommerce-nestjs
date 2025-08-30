// import { IDistrict, IProvince, IWard } from "./vn-public-apis.interface";
import { IDistrict, IProvince, IWard } from './tinhthanhpho_com_api.interface';

export interface ISupplierLocation {
  name: string; // Name of the supplier
  address: {
    province: IProvince;
    district: IDistrict;
    ward: IWard;
    street: string;
  };
  telephone: string; // Contact phone number
  debt?: ISupplierDebt; // Optional field for supplier debt
  email?: string; // Contact email
  position?: {
    lat: string | number; // Latitude for geolocation
    lng: string | number; // Longitude for geolocation
  };
  url?: string; // Website URL (optional)
  taxID?: string; // Tax identification number (optional)
  contactPoint?: {
    contactType: string; // Type of contact (e.g., Customer Support)
    name: string; // Name of the contact person
    telephone: string; // Contact phone number
    email: string; // Contact email
  };
  logo?: string; // URL to the supplier's logo (optional)
  sameAs?: string[]; // URLs to social media or related profiles (optional)
}

export interface ISupplierDebt {
  amount: number; // Amount owed to the supplier
  note: string; // Additional notes (optional)
}
