import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomBadRequestException, CustomInternalServerErrorException } from 'src/shared/core/exception/custom-exception';
import { MediaLogoService } from '../media-logo.service';
import { PurposeOfMedia } from 'src/constant/media.constant';
@Injectable()
export class ValidateModifyLogoAlbumGuard implements CanActivate {
  constructor(
    private readonly mediaLogoService: MediaLogoService,
    private readonly configService: ConfigService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const album = await this.mediaLogoService.getDetail();

    if (!album) {
      throw new CustomBadRequestException('Không tìm thấy Logo Album');
    };

    if (!album.relativePath) {
      throw new CustomInternalServerErrorException('Không tìm thấy đường dẫn của Logo Album');
    }

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};

    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = `media/${PurposeOfMedia.LOGO}`;
    request.customParams.purposeOfMedia = PurposeOfMedia.LOGO;

    return true;
  }
}