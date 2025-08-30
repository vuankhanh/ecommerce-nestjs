import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CustomBadRequestException,
  CustomInternalServerErrorException,
} from 'src/shared/core/exception/custom-exception';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { MediaProductService } from '../media-product.service';
@Injectable()
export class ValidateModifyProductAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaProductService: MediaProductService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const query = request.query;
    const id = query.id;
    const slug = request.slug;
    if (!id && !slug) {
      throw new CustomBadRequestException('ID hoặc slug không được để trống');
    }

    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    const product = await this.mediaProductService.getDetail(filterQuery);

    if (!product) {
      throw new CustomBadRequestException('Không tìm thấy Product Album');
    }

    if (!product.relativePath) {
      throw new CustomInternalServerErrorException(
        'Không tìm thấy đường dẫn của Product Album',
      );
    }

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};

    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = product.relativePath;
    request.customParams.purposeOfMedia = PurposeOfMedia.PRODUCT;

    return true;
  }
}
