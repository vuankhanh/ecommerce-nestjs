import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomConflictException } from 'src/shared/core/exception/custom-exception';
import { MediaLogoService } from '../media-logo.service';
import { PurposeOfMedia } from 'src/constant/media.constant';

@Injectable()
export class ValidateCreateLogoAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaLogoService: MediaLogoService,
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

    const isExists = await this.mediaLogoService.checkExistLogoAlbum();
    if (isExists) {
      throw new CustomConflictException('Logo album đã tồn tại');
    };

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};
    
    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.LOGO}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.LOGO;
    
    return true;
  }
}
