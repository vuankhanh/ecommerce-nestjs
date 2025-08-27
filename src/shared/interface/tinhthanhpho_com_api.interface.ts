export interface IProvince {
  province_id: number,
  code: string,
  name: string,
  type: string
}

export interface IDistrict {
  district_id: number,
  code: string,
  name: string,
  type: string,
  province_code: string
}

export interface IWard {
  ward_id: number,
  code: string,
  name: string,
  type: string,
  district_code: string,
  province_code: string
}

export interface ITinhthanhphoComApiResponse<T extends IProvince[] | IDistrict[] | IWard[]> {
  success: boolean,
  data: T,
  metadata: {
    total: number,
    page: number,
    limit: number
  }
}