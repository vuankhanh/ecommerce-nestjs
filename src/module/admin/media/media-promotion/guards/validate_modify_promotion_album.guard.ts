import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomBadRequestException, CustomInternalServerErrorException } from 'src/shared/core/exception/custom-exception';
import { MediaPromotionService } from '../media-promotion.service';
import { PurposeOfMedia } from 'src/constant/media.constant';
@Injectable()
export class ValidateModifyPromotionAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaPromotionService: MediaPromotionService,
    private readonly configService: ConfigService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const album = await this.mediaPromotionService.getDetail();

    if (!album) {
      throw new CustomBadRequestException('Không tìm thấy Promotion Album');
    };

    if (!album.relativePath) {
      throw new CustomInternalServerErrorException('Không tìm thấy đường dẫn của Promotion Album');
    }

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};

    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.PROMOTION}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.PROMOTION;

    return true;
  }
}