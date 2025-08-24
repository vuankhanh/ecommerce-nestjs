import { Body, Controller, DefaultValuePipe, Delete, Get, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from '../../../shared/schema/product.schema';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/core/pipes/parse_objectId_array.pipe';
import { ObjectId } from 'mongodb';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { VietnameseAccentUtil } from 'src/shared/util/vietnamese-accent.util';

//1. Guards: Được sử dụng để bảo vệ các slug.
//2. Interceptors: Được sử dụng để thay đổi hoặc mở rộng hành vi của các method.
//3. Pipes: Được sử dụng để biến đổi hoặc xác thực dữ liệu.
@Controller()
@UseGuards(LocalAuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.productService.getAll(filterQuery, page, size);
  }

  @Get('detail')
  async getDetail(
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    return await this.productService.getDetail(filterQuery);
  }

  @Post()
  async create(
    @Body() productDto: ProductDto
  ) {
    const product = new Product(productDto);
    if (productDto.albumId) product.updateAlbumId = productDto.albumId;
    if (productDto.productCategoryId) product.updateProductCategoryId = productDto.productCategoryId;

    return await this.productService.create(product);
  }

  @Put()
  async replace(
    @Body() productDto: ProductDto,
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    const product: Product = new Product(productDto);
    if (productDto.albumId) product.updateAlbumId = productDto.albumId;
    if (productDto.productCategoryId) product.updateProductCategoryId = productDto.productCategoryId;

    return await this.productService.replace(filterQuery, product);
  }

  @Patch()
  async modify(
    @Body() productDto: UpdateProductDto,
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    const data: Partial<Product> = productDto;
    if (productDto.albumId) data.albumId = ObjectId.createFromHexString(productDto.albumId);
    if (productDto.productCategoryId) data.productCategoryId = ObjectId.createFromHexString(productDto.productCategoryId);
    if (productDto.name) {
      const nonAaccentVName = VietnameseAccentUtil.toNonAccentVietnamese(productDto.name.vi);
      data.slug = VietnameseAccentUtil.replaceSpaceToDash(nonAaccentVName);
    }

    return await this.productService.modify(filterQuery, data);
  }

  @Delete()
  async delete(
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    return await this.productService.remove(filterQuery);
  }
}
