import { Body, Controller, Get, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { ChangeUploadfileNamePipe, ChangeUploadfilesNamePipe } from 'src/shared/core/pipes/change-uploadfile-name.pipe';
import { DiskStoragePipe } from 'src/shared/core/pipes/disk-storage.pipe';
import { FileProcessPipe, FilesProcessPipe } from 'src/shared/core/pipes/file_process.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { Album } from '../schema/album.schema';
import { MediaLogoService } from './media-logo.service';
import { FileProccedInterceptor } from 'src/shared/core/interceptors/file_procced.interceptor';
import { ValidateCreateLogoAlbumGuard } from './guards/validate_create_logo_album.guard';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';

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
    const logo = await this.mediaLogoService.getMainLogo();
    if (!logo) {
      return { message: 'No logo found' };
    }
    return logo;
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
    console.log(`medias: ${media}`);
    media.description = media.description || '';
    const album: IAlbum = {
      name: 'Logo',
      route: 'logo',
      purposeOfMedia: PurposeOfMedia.LOGO,
      media: [media],
      relativePath,
      thumbnailUrl: media.thumbnailUrl,
      mainMedia: 0
    }
    const albumDoc: Album = new Album(album);
    const createdAlbum = await this.mediaLogoService.create(albumDoc);
    return createdAlbum;
  }
}
