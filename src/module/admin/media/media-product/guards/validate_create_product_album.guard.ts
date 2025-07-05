import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomBadRequestException, CustomConflictException } from 'src/shared/core/exception/custom-exception';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { MediaProductService } from '../media-product.service';
import { VietnameseAccentUtil } from 'src/shared/util/vietnamese-accent.util';

@Injectable()
export class ValidateCreateProductAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaProductService: MediaProductService,
    private readonly configService: ConfigService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];

    const checkContentType: boolean = contentType && contentType.includes('multipart/form-data');

    if (!checkContentType) {
      return false;
    }

    const query = request.query;
    const name = query.name;
    if (!name) {
      throw new CustomBadRequestException('Tên không được để trống');
    }

    const nonAccentVietnameseName = VietnameseAccentUtil.toNonAccentVietnamese(name);
    const slug = VietnameseAccentUtil.replaceSpaceToDash(nonAccentVietnameseName);

    const filterQuery = { slug };

    const isExists = await this.mediaProductService.checkExistProductAlbum(filterQuery);
    if (isExists) {
      throw new CustomConflictException('Product Album đã tồn tại');
    };

    
    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};

    request.customParams.slug = slug;
    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.PRODUCT}/${slug}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.PRODUCT;

    return true;
  }
}
