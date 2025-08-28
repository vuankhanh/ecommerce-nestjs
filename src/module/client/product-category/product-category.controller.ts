import { Controller, DefaultValuePipe, Get, Headers, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ProductCategoryService } from './product-category.service';
import { Product_Category } from 'src/shared/schema/product-category.schema';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { TLanguage } from 'src/shared/interface/lang.interface';

@Controller('product-category')
@UseInterceptors(FormatResponseInterceptor)
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Headers('accept-language') lang: TLanguage,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.productCategoryService.getAll(filterQuery, lang, page, size);
  }

  @Get('detail')
  async getDetail(
    @Query('slug') slug: string,
    @Headers('accept-language') lang: TLanguage,
  ) {
    const filterQuery = { slug };
    
    return await this.productCategoryService.getDetail(filterQuery, lang);
  }
}
