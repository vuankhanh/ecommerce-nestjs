import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { IProvince } from 'src/shared/interface/vn-public-apis.interface';

@Injectable()
export class VnPublicApisService {
  private readonly vnPublicApi: string;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const vnPublicApi = this.configService.get('vnPublicApi');
    this.vnPublicApi = `${vnPublicApi.protocol}://${vnPublicApi.host}:${vnPublicApi.port}`;
  }
  
  async getProvinces(): Promise<IProvince[]> {
    const url: string = `${this.vnPublicApi}/provinces/getAll?limit=-1`;
    return await axios.get(url).then(res => res.data).then(res => res.data);
  }

  async getDistricts(provinceCode: string): Promise<IProvince[]> {
    const url: string = `${this.vnPublicApi}/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`;
    return await axios.get(url).then(res => res.data).then(res => res.data);
  }

  async getWards(districtCode: string): Promise<IProvince[]> {
    const url: string = `${this.vnPublicApi}/wards/getByDistrict?districtCode=${districtCode}&limit=-1`;
    return await axios.get(url).then(res => res.data).then(res => res.data);
  }
}
