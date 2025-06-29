import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomBadRequestException, CustomConflictException } from 'src/shared/core/exception/custom-exception';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { MediaProductCategoryService } from '../media-product-category.service';

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
    const id = query.id;
    const route = request.route;
    if (!id && !route) {
      throw new CustomBadRequestException('ID hoặc route không được để trống');
    }

    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (route) filterQuery['route'] = route;

    const isExists = await this.mediaProductCategoryService.checkExistProductCategoryAlbum(filterQuery);
    if (isExists) {
      throw new CustomConflictException('Product Category Album đã tồn tại');
    };

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};

    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.PRODUCT_CATEGORY}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;

    return true;
  }
}
