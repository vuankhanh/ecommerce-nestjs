import { Controller, DefaultValuePipe, Get, Headers, ParseIntPipe, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '../../../shared/schema/product.schema';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/core/pipes/parse_objectId_array.pipe';

//1. Guards: Được sử dụng để bảo vệ các slug.
//2. Interceptors: Được sử dụng để thay đổi hoặc mở rộng hành vi của các method.
//3. Pipes: Được sử dụng để biến đổi hoặc xác thực dữ liệu.
@Controller('product')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('productCategoryId', new ParseObjectIdPipe()) productCategoryId: string,
    @Headers('accept-language') lang: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
    if (productCategoryId) filterQuery['productCategoryId'] = productCategoryId;

    return await this.productService.getAll(filterQuery, lang, page, size);
  }

  @Get('detail')
  async getDetail(
    @Headers('accept-language') lang: string,
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string,
  ) {
    
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;

    return await this.productService.getDetail(filterQuery, lang);
  }

  @Get('/by-category-slug')
  async getProductsByCategorySlug(
    @Headers('accept-language') lang: string,
    @Query('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ){
    return await this.productService.getProductsByCategorySlug(slug, lang, page, size);
  }
}
