import { Body, Controller, DefaultValuePipe, Delete, Get, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { MediaProductCategoryService } from './media-product-category.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ValidateCreateProductCategoryAlbumGuard } from './guards/validate_create_product_category_album.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { FileProccedInterceptor } from 'src/shared/core/interceptors/file_procced.interceptor';
import { ChangeUploadfileNamePipe } from 'src/shared/core/pipes/change-uploadfile-name.pipe';
import { FileProcessPipe } from 'src/shared/core/pipes/file_process.pipe';
import { DiskStoragePipe } from 'src/shared/core/pipes/disk-storage.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { Media } from '../../../../shared/schema/media.schema';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { Album } from '../../../../shared/schema/album.schema';
import { ValidateModifyProductCategoryAlbumGuard } from './guards/validate_modify_product_category_album.guard';
import { ParseObjectIdArrayPipe } from 'src/shared/core/pipes/parse_objectId_array.pipe';
import { ProductCategoryModifyItemIndexChangeDto, ProductCategoryModifyRemoveFilesDto } from './dto/product_category_modify.dto';
import { UserRole } from 'src/constant/user.constant';

@Controller()
@UseGuards(LocalAuthGuard)
@Roles(UserRole.ADMIN)
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class MediaProductCategoryController {
  constructor(
    private readonly mediaProductCategoryService: MediaProductCategoryService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
    const metaData = await this.mediaProductCategoryService.getAll(filterQuery, page, size);

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

    return await this.mediaProductCategoryService.getDetail(filterQuery);
  }

  @Get('main')
  async getMainProductCategory(
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    return await this.mediaProductCategoryService.getMainProductCategory(filterQuery);;
  }

  @Post()
  @UseGuards(ValidateCreateProductCategoryAlbumGuard)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FileProccedInterceptor
  )
  async create(
    @Req() req: Request,
    @Query('name') name: string,
    @UploadedFile(ChangeUploadfileNamePipe, FileProcessPipe, DiskStoragePipe) media: IMedia
  ) {
    console.log(req.query);
    const customParams = req['customParams'];
    const relativePath = customParams.relativePath;
    const slug = customParams.slug;
    const newMedia: Media = new Media(media);

    console.log(`name: ${name}`);
    console.log(`slug: ${slug}`);

    const album: IAlbum = {
      name,
      slug,
      purposeOfMedia: PurposeOfMedia.PRODUCT_CATEGORY,
      media: [newMedia],
      relativePath,
      thumbnailUrl: media.thumbnailUrl,
      mainMedia: 0
    }
    const albumDoc: Album = new Album(album);
    const createdAlbum = await this.mediaProductCategoryService.create(albumDoc);
    return createdAlbum;
  }

  @Patch('add-new-files')
  @UseGuards(ValidateModifyProductCategoryAlbumGuard)
  @UseInterceptors(
    FileInterceptor('file', memoryStorageMulterOptions),
    FileProccedInterceptor
  )
  async addNewFiles(
    @UploadedFile(ChangeUploadfileNamePipe, FileProcessPipe, DiskStoragePipe) media: IMedia,
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string,
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    const newMedia: Media = new Media(media);
    const updatedAlbums = await this.mediaProductCategoryService.addNewFiles(filterQuery, newMedia);
    return updatedAlbums;
  }

  @Patch('remove-files')
  async removeFiles(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('filesWillRemove')) body: ProductCategoryModifyRemoveFilesDto,
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string,
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;
    
    const updatedAlbums = await this.mediaProductCategoryService.removeFiles(filterQuery, body.filesWillRemove);
    return updatedAlbums;
  }

  @Patch('item-index-change')
  async itemIndexChange(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('newItemIndexChange')) body: ProductCategoryModifyItemIndexChangeDto,
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string,
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    const updatedAlbums = await this.mediaProductCategoryService.itemIndexChange(filterQuery, body.newItemIndexChange);
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

    return await this.mediaProductCategoryService.remove(filterQuery);
  }
}