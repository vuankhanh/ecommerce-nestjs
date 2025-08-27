// import { IDistrict, IProvince, IWard } from "../interface/vn-public-apis.interface";
import { IDistrict, IProvince, IWard } from "../interface/tinhthanhpho_com_api.interface";

export const validateAddressProvince = (province: IProvince) => {
  return typeof province === 'object' &&
    typeof province.province_id === 'number' &&
    typeof province.name === 'string' &&
    typeof province.type === 'string' &&
    typeof province.code === 'string'
}

export const validateAddressDistrict = (district: IDistrict) => {
  return typeof district === 'object' &&
    typeof district.district_id === 'number' &&
    typeof district.code === 'string' &&
    typeof district.name === 'string' &&
    typeof district.type === 'string' &&
    typeof district.province_code === 'string'
}

export const validateAddressWard = (ward: IWard) => {
  return typeof ward === 'object' &&
    typeof ward.ward_id === 'number' &&
    typeof ward.code === 'string' &&
    typeof ward.name === 'string' &&
    typeof ward.type === 'string' &&
    typeof ward.district_code === 'string' &&
    typeof ward.province_code === 'string'
}