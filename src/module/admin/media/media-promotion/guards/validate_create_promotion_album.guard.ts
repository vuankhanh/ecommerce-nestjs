import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomConflictException } from 'src/shared/core/exception/custom-exception';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { MediaPromotionService } from '../media-promotion.service';

@Injectable()
export class ValidateCreatePromotionAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaPromotionService: MediaPromotionService,
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

    const isExists = await this.mediaPromotionService.checkExistPromotionAlbum();
    if (isExists) {
      throw new CustomConflictException('Promotion album đã tồn tại');
    };

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};
    
    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.PROMOTION}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.PROMOTION;
    
    return true;
  }
}
