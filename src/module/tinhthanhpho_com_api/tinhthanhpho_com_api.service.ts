import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { IDistrict, IProvince, ITinhthanhphoComApiResponse, IWard } from 'src/shared/interface/tinhthanhpho_com_api.interface';

@Injectable()
export class TinhthanhphoComApiService {
  private readonly tinhthanhphoComApiUrl: string;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const tinhthanhphoComApi = this.configService.get('tinhthanhphoComApi');
    this.tinhthanhphoComApiUrl = `${tinhthanhphoComApi.protocol}://${tinhthanhphoComApi.host}:${tinhthanhphoComApi.port}`;
  }

  async getProvinces(
    keyword: string = '',
    limit: number = 20,
    page: number = 1
  ): Promise<ITinhthanhphoComApiResponse<IProvince[]>> {
    const url: string = `${this.tinhthanhphoComApiUrl}/api/v1/provinces`;
    const config: AxiosRequestConfig = {
      params: {
        keyword,
        limit,
        page
      }
    }
    return await axios.get(url, config).then(res => res.data);
  }

  async getDistricts(
    provinceCode: string,
    keyword: string = '',
    limit: number = 20,
    page: number = 1
  ): Promise<ITinhthanhphoComApiResponse<IDistrict[]>> {
    const url: string = `${this.tinhthanhphoComApiUrl}/api/v1/provinces/${provinceCode}/districts`;
    const config: AxiosRequestConfig = {
      params: {
        keyword,
        limit,
        page
      }
    }
    return await axios.get(url, config).then(res => res.data);
  }

  async getWards(
    districtCode: string,
    keyword: string = '',
    limit: number = 20,
    page: number = 1
  ): Promise<ITinhthanhphoComApiResponse<IWard[]>> {
    const url: string = `${this.tinhthanhphoComApiUrl}/api/v1/districts/${districtCode}/wards`;
    const config: AxiosRequestConfig = {
      params: {
        keyword,
        limit,
        page
      }
    }
    return await axios.get(url, config).then(res => res.data);
  }
}
