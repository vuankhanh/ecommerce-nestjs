import { Controller, Get, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { ChangeUploadfileNamePipe } from 'src/shared/core/pipes/change-uploadfile-name.pipe';
import { DiskStoragePipe } from 'src/shared/core/pipes/disk-storage.pipe';
import { FileProcessPipe } from 'src/shared/core/pipes/file_process.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { Album } from '../../../../shared/schema/album.schema';
import { MediaLogoService } from './media-logo.service';
import { FileProccedInterceptor } from 'src/shared/core/interceptors/file_procced.interceptor';
import { ValidateCreateLogoAlbumGuard } from './guards/validate_create_logo_album.guard';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { Media } from '../../../../shared/schema/media.schema';
import { ValidateModifyLogoAlbumGuard } from './guards/validate_modify_logo_album.guard';

@Controller()
@UseGuards(LocalAuthGuard)
@Roles('admin')
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class MediaLogoController {
  constructor(
    private readonly mediaLogoService: MediaLogoService
  ) { }

  @Get()
  async get() {
    const albums = await this.mediaLogoService.getDetail();
    return albums;
  }

  @Get('main')
  async getMainLogo() {
    return await this.mediaLogoService.getMainLogo();;
  }

  @Post()
  @UseGuards(ValidateCreateLogoAlbumGuard)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FileProccedInterceptor
  )
  async create(
    @Req() req: Request,
    @UploadedFile(ChangeUploadfileNamePipe, FileProcessPipe, DiskStoragePipe) media: IMedia
  ) {
    const relativePath = req['customParams'].relativePath ;
    const newMedia: Media = new Media(media);
    const album: IAlbum = {
      name: 'Logo',
      slug: 'logo',
      purposeOfMedia: PurposeOfMedia.LOGO,
      media: [newMedia],
      relativePath,
      thumbnailUrl: media.thumbnailUrl,
      mainMedia: 0
    }
    const albumDoc: Album = new Album(album);
    const createdAlbum = await this.mediaLogoService.create(albumDoc);
    return createdAlbum;
  }

  @Patch()
  @UseGuards(ValidateModifyLogoAlbumGuard)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FileProccedInterceptor
  )
  async insert(
    @UploadedFile(ChangeUploadfileNamePipe, FileProcessPipe, DiskStoragePipe) media: IMedia,
  ) {
    const newMedia: Media = new Media(media);

    return await this.mediaLogoService.insert(newMedia);
  }
}
