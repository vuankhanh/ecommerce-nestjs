import { Body, Controller, DefaultValuePipe, Delete, Get, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { MediaProductService } from './media-product.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ValidateCreateProductAlbumGuard } from './guards/validate_create_product_album.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { FileProccedInterceptor } from 'src/shared/core/interceptors/file_procced.interceptor';
import { ChangeUploadfileNamePipe, ChangeUploadfilesNamePipe } from 'src/shared/core/pipes/change-uploadfile-name.pipe';
import { FileProcessPipe, FilesProcessPipe } from 'src/shared/core/pipes/file_process.pipe';
import { DiskStoragePipe } from 'src/shared/core/pipes/disk-storage.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { Media } from '../../../../shared/schema/media.schema';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { Album } from '../../../../shared/schema/album.schema';
import { ValidateModifyProductAlbumGuard } from './guards/validate_modify_product_album.guard';
import { ParseObjectIdArrayPipe } from 'src/shared/core/pipes/parse_objectId_array.pipe';
import { ProductModifyItemIndexChangeDto, ProductModifyRemoveFilesDto } from './dto/product_modify.dto';
import { FilesProccedInterceptor } from 'src/shared/core/interceptors/files_procced.interceptor';
import { UserRole } from 'src/constant/user.constant';

@Controller()
@UseGuards(LocalAuthGuard)
@Roles(UserRole.ADMIN)
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class MediaProductController {
  constructor(
    private readonly mediaProductService: MediaProductService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
    const metaData = await this.mediaProductService.getAll(filterQuery, page, size);

    return metaData;
  }

  @Get('detail')
  async getDetail(
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    return await this.mediaProductService.getDetail(filterQuery);
  }

  @Get('main')
  async getMainProduct(
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    return await this.mediaProductService.getMainProduct(filterQuery);;
  }

  @Post()
  @UseGuards(ValidateCreateProductAlbumGuard)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor
  )
  async create(
    @Req() req: Request,
    @Query('name') name: string,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: IMedia[]
  ) {
    const customParams = req['customParams'];
    const relativePath = customParams.relativePath;
    const slug = customParams.slug;
    const newMedias: Media[] = medias.map(media=>new Media(media));

    const album: IAlbum = {
      name,
      slug,
      purposeOfMedia: PurposeOfMedia.PRODUCT,
      media: newMedias,
      relativePath,
      thumbnailUrl: newMedias[0].thumbnailUrl,
      mainMedia: 0
    }
    const albumDoc: Album = new Album(album);
    const createdAlbum = await this.mediaProductService.create(albumDoc);
    return createdAlbum;
  }

  @Patch('add-new-files')
  @UseGuards(ValidateModifyProductAlbumGuard)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor
  )
  async addNewFiles(
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: IMedia[],
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string,
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    const newMedias: Media[] = medias.map(media=>new Media(media));
    const updatedAlbums = await this.mediaProductService.addNewFiles(filterQuery, newMedias);
    return updatedAlbums;
  }

  @Patch('remove-files')
  async removeFiles(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('filesWillRemove')) body: ProductModifyRemoveFilesDto,
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string,
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    const updatedAlbums = await this.mediaProductService.removeFiles(filterQuery, body.filesWillRemove);
    return updatedAlbums;
  }

  @Patch('item-index-change')
  async itemIndexChange(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('newItemIndexChange')) body: ProductModifyItemIndexChangeDto,
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string,
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    const updatedAlbums = await this.mediaProductService.itemIndexChange(filterQuery, body.newItemIndexChange);
    return updatedAlbums;
  }

  @Delete()
  async remove(
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string,
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    return await this.mediaProductService.remove(filterQuery);
  }
}
