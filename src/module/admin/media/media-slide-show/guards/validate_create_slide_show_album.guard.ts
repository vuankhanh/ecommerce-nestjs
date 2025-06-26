import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomConflictException } from 'src/shared/core/exception/custom-exception';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { MediaSlideShowService } from '../media-slide-show.service';

@Injectable()
export class ValidateCreateSlideShowAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaSlideShowService: MediaSlideShowService,
    private readonly configService: ConfigService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    console.log('ValidateCreateSlideShowAlbumGuard is running...');
    
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];
    
    const checkContentType: boolean = contentType && contentType.includes('multipart/form-data');
    
    if (!checkContentType) {
      return false;
    }

    const isExists = await this.mediaSlideShowService.checkExistSlideShowAlbum();
    if (isExists) {
      throw new CustomConflictException('Slide show album đã tồn tại');
    };

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};
    
    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.SLIDE_SHOW}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.SLIDE_SHOW;
    
    return true;
  }
}
