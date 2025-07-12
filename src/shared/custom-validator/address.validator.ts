import { IDistrict, IProvince, IWard } from "../interface/vn-public-apis.interface";

export const validateAddressProvince = (province: IProvince) => {
  return typeof province === 'object' &&
    typeof province._id === 'string' &&
    typeof province.name === 'string' &&
    typeof province.slug === 'string' &&
    typeof province.type === 'string' &&
    typeof province.name_with_type === 'string' &&
    typeof province.code === 'string' &&
    typeof province.isDeleted === 'boolean';
}

export const validateAddressDistrict = (district: IDistrict) => {
  return typeof district === 'object' &&
    typeof district._id === 'string' &&
    typeof district.name === 'string' &&
    typeof district.type === 'string' &&
    typeof district.slug === 'string' &&
    typeof district.name_with_type === 'string' &&
    typeof district.path === 'string' &&
    typeof district.path_with_type === 'string' &&
    typeof district.code === 'string' &&
    typeof district.parent_code === 'string' &&
    typeof district.isDeleted === 'boolean';
}

export const validateAddressWard = (ward: IWard) => {
  return typeof ward === 'object' &&
    typeof ward._id === 'string' &&
    typeof ward.name === 'string' &&
    typeof ward.type === 'string' &&
    typeof ward.slug === 'string' &&
    typeof ward.name_with_type === 'string' &&
    typeof ward.path === 'string' &&
    typeof ward.path_with_type === 'string' &&
    typeof ward.code === 'string' &&
    typeof ward.parent_code === 'string' &&
    typeof ward.isDeleted === 'boolean';
}