import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { ProductCategoryDto, UpdateProductCategoryDto } from './dto/product-category.dto';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { ProductCategoryService } from './product-category.service';
import { Product_Category } from 'src/shared/schema/product-category.schema';
import { CustomBadRequestException, CustomInternalServerErrorException } from 'src/shared/core/exception/custom-exception';
import { ObjectId } from 'mongodb';
@Controller()
@UseGuards(LocalAuthGuard)
@Roles('admin')
@UsePipes(ValidationPipe)
@UseInterceptors(FormatResponseInterceptor)
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService
  ) {}
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

  @Get(':slug')
  async getDetail(
    @Param('slug') slug: string,
  ) {
    const filterQuery = { slug };

    return await this.productCategoryService.getDetail(filterQuery);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() body: ProductCategoryDto
  ) {
    const productCategory: Product_Category = new Product_Category(body);
    if(body.parentId) {
      productCategory.updateParentId = body.parentId;
    }

    try {
      const createdProductCategory = await this.productCategoryService.create(productCategory);
      return createdProductCategory;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomBadRequestException('Tên danh mục đã tồn tại, vui lòng chọn tên khác');
      }
      throw new CustomInternalServerErrorException('Lỗi khi tạo danh mục sản phẩm');
    }
  }

  @Put(':slug')
  @HttpCode(HttpStatus.OK)
  async replace(
    @Param('slug') slug: string,
    @Body() body: ProductCategoryDto
  ) {
    const filterQuery = { slug };
    const productCategory: Product_Category = new Product_Category(body);
    if(body.parentId) {
      productCategory.updateParentId = body.parentId;
    }

    try {
      const updatedProductCategory = await this.productCategoryService.replace(filterQuery, productCategory);
      return updatedProductCategory;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomBadRequestException('Tên danh mục đã tồn tại, vui lòng chọn tên khác');
      }
      throw new CustomInternalServerErrorException('Lỗi khi cập nhật danh mục sản phẩm');
    }
  }

  @Patch(':slug')
  @HttpCode(HttpStatus.OK)
  async modify(
    @Param('slug') slug: string,
    @Body() body: UpdateProductCategoryDto
  ) {
    const filterQuery = { slug };
    const data: Partial<Product_Category> = body;
    if (body.parentId) data.parentId = ObjectId.createFromHexString(body.parentId.toString());

    try {
      const modifiedProductCategory = await this.productCategoryService.modify(filterQuery, data);
      return modifiedProductCategory;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomBadRequestException('Tên danh mục đã tồn tại, vui lòng chọn tên khác');
      }
      throw new CustomInternalServerErrorException('Lỗi khi cập nhật danh mục sản phẩm');
    }
  }
}
