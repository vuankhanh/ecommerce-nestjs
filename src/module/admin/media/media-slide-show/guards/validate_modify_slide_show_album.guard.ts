import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CustomBadRequestException,
  CustomInternalServerErrorException,
} from 'src/shared/core/exception/custom-exception';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { MediaSlideShowService } from '../media-slide-show.service';
@Injectable()
export class ValidateModifySlideShowAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaSlideShowService: MediaSlideShowService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const album = await this.mediaSlideShowService.getDetail();

    if (!album) {
      throw new CustomBadRequestException('Không tìm thấy slide show Album');
    }

    if (!album.relativePath) {
      throw new CustomInternalServerErrorException(
        'Không tìm thấy đường dẫn của Slide Show Album',
      );
    }

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};

    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.SLIDE_SHOW}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.SLIDE_SHOW;

    return true;
  }
}
