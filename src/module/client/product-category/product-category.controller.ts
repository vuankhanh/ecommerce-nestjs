import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ProductCategoryService } from './product-category.service';
import { Product_Category } from 'src/shared/schema/product-category.schema';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('product-category')
@UseInterceptors(FormatResponseInterceptor)
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.productCategoryService.getAll(filterQuery, page, size);
  }

  @Get('detail')
  async getDetail(
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('slug') slug?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (slug) filterQuery['slug'] = slug;
    
    return await this.productCategoryService.getDetail(filterQuery);
  }
}
