import { Body, Controller, Delete, Get, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MediaSlideShowService } from './media-slide-show.service';
import { ValidateCreateSlideShowAlbumGuard } from './guards/validate_create_slide_show_album.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { FilesProccedInterceptor } from 'src/shared/core/interceptors/files_procced.interceptor';
import { ChangeUploadfilesNamePipe } from 'src/shared/core/pipes/change-uploadfile-name.pipe';
import { FilesProcessPipe } from 'src/shared/core/pipes/file_process.pipe';
import { DiskStoragePipe } from 'src/shared/core/pipes/disk-storage.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { Album } from '../../../../shared/schema/album.schema';
import { ValidateModifySlideShowAlbumGuard } from './guards/validate_modify_slide_show_album.guard';
import { ParseObjectIdArrayPipe } from 'src/shared/core/pipes/parse_objectId_array.pipe';
import { SlideShowModifyItemIndexChangeDto, SlideShowModifyRemoveFilesDto } from './dto/slide_show_modify.dto';
import { Media } from '../../../../shared/schema/media.schema';

@Controller()
@UseGuards(LocalAuthGuard)
@Roles('admin')
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class MediaSlideShowController {
  constructor(
    private readonly mediaSlideShowService: MediaSlideShowService
  ) { }

  @Get()
  async getDetail() {
    return await this.mediaSlideShowService.getDetail();
  }

  @Post()
  @UseGuards(ValidateCreateSlideShowAlbumGuard)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor
  )
  async create(
    @Req() req: Request,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: IMedia[]
  ) {
    const relativePath = req['customParams'].relativePath;

    const newMedias: IMedia[] = medias.map(media => new Media(media));
    const mainMedia = 0;
    const album: IAlbum = {
      name: 'Slide Show',
      slug: 'slide-show',
      purposeOfMedia: PurposeOfMedia.SLIDE_SHOW,
      media: newMedias,
      relativePath,
      thumbnailUrl: newMedias[mainMedia].thumbnailUrl,
      mainMedia
    }
    const albumDoc: Album = new Album(album);
    const createdAlbum = await this.mediaSlideShowService.create(albumDoc);
    return createdAlbum;
  }

  @Patch('add-new-files')
  @UseGuards(ValidateModifySlideShowAlbumGuard)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor
  )
  async addNewFiles(
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    const updatedAlbums = await this.mediaSlideShowService.addNewFiles(medias);
    return updatedAlbums;
  }

  @Patch('remove-files')
  async removeFiles(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('filesWillRemove')) body: SlideShowModifyRemoveFilesDto,
  ) {
    const updatedAlbums = await this.mediaSlideShowService.removeFiles(body.filesWillRemove);
    return updatedAlbums;
  }

  @Patch('item-index-change')
  async itemIndexChange(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('newItemIndexChange')) body: SlideShowModifyItemIndexChangeDto,
  ) {
    const updatedAlbums = await this.mediaSlideShowService.itemIndexChange(body.newItemIndexChange);
    return updatedAlbums;
  }

  @Delete()
  async remove() {
    return await this.mediaSlideShowService.remove();
  }

}
