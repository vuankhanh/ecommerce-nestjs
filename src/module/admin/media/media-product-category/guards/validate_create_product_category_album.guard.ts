import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomBadRequestException, CustomConflictException } from 'src/shared/core/exception/custom-exception';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { MediaProductCategoryService } from '../media-product-category.service';
import { VietnameseAccentUtil } from 'src/shared/util/vietnamese-accent.util';

@Injectable()
export class ValidateCreateProductCategoryAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaProductCategoryService: MediaProductCategoryService,
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
    const route = VietnameseAccentUtil.replaceSpaceToDash(nonAccentVietnameseName);

    const filterQuery = { route };

    const isExists = await this.mediaProductCategoryService.checkExistProductCategoryAlbum(filterQuery);
    if (isExists) {
      throw new CustomConflictException('Product Category Album đã tồn tại');
    };

    
    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};

    request.customParams.route = route;
    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.PRODUCT_CATEGORY}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;

    return true;
  }
}
