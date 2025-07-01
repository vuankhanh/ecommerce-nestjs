import { Controller, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MediaPromotionService } from './media-promotion.service';
import { ValidateCreatePromotionAlbumGuard } from './guards/validate_create_promotion_album.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { FileProccedInterceptor } from 'src/shared/core/interceptors/file_procced.interceptor';
import { ChangeUploadfileNamePipe } from 'src/shared/core/pipes/change-uploadfile-name.pipe';
import { FileProcessPipe } from 'src/shared/core/pipes/file_process.pipe';
import { DiskStoragePipe } from 'src/shared/core/pipes/disk-storage.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { Media } from '../schema/media.schema';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { Album } from '../schema/album.schema';
import { ValidateModifyPromotionAlbumGuard } from './guards/validate_modify_promotion_album.guard';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';

@Controller()
@UseGuards(LocalAuthGuard)
@Roles('admin')
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class MediaPromotionController {
  constructor(
    private readonly mediaPromotionService: MediaPromotionService
  ) { }

  @Get()
  async get() {
    const albums = await this.mediaPromotionService.getDetail();
    return albums;
  }

  @Get('main')
  async getMainLogo() {
    return await this.mediaPromotionService.getMainLogo();;
  }

  @Post()
  @UseGuards(ValidateCreatePromotionAlbumGuard)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FileProccedInterceptor
  )
  async create(
    @Req() req: Request,
    @UploadedFile(ChangeUploadfileNamePipe, FileProcessPipe, DiskStoragePipe) media: IMedia
  ) {
    const relativePath = req['customParams'].relativePath;
    const newMedia: Media = new Media(media);
    const album: IAlbum = {
      name: 'Promotion',
      slug: 'prmotion',
      purposeOfMedia: PurposeOfMedia.PROMOTION,
      media: [newMedia],
      relativePath,
      thumbnailUrl: media.thumbnailUrl,
      mainMedia: 0
    }
    const albumDoc: Album = new Album(album);
    const createdAlbum = await this.mediaPromotionService.create(albumDoc);
    return createdAlbum;
  }

  @Patch()
  @UseGuards(ValidateModifyPromotionAlbumGuard)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FileProccedInterceptor
  )
  async insert(
    @UploadedFile(ChangeUploadfileNamePipe, FileProcessPipe, DiskStoragePipe) media: IMedia,
  ) {
    const newMedia: Media = new Media(media);

    return await this.mediaPromotionService.insert(newMedia);
  }
}
