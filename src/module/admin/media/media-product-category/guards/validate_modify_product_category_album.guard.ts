import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomBadRequestException, CustomInternalServerErrorException } from 'src/shared/core/exception/custom-exception';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { MediaProductCategoryService } from '../media-product-category.service';
@Injectable()
export class ValidateModifyProductCategoryAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaProductCategoryService: MediaProductCategoryService,
    private readonly configService: ConfigService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
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

    const productCategory = await this.mediaProductCategoryService.getDetail(filterQuery);

    if (!productCategory) {
      throw new CustomBadRequestException('Không tìm thấy Product Category Album');
    };

    if (!productCategory.relativePath) {
      throw new CustomInternalServerErrorException('Không tìm thấy đường dẫn của Product Category Album');
    }

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};

    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = productCategory.relativePath;
    request.customParams.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;

    return true;
  }
}