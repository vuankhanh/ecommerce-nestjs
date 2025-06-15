import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SupplierProductService } from './supplier_product.service';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { SupplierProductDto, UpdateSupplierProductDto } from './dto/supplier_product.dto';
import { Supplier_Product } from './schema/supplier_product.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { SupplierLocationService } from '../supplier_location/supplier_location.service';
import { CustomBadRequestException } from 'src/shared/exception/custom-exception';
import { ObjectId } from 'mongodb';
import { LocalAuthGuard } from 'src/shared/guards/auth.guard';

@Controller('supplier_product')
@UseGuards(LocalAuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class SupplierProductController {
  constructor(
    private readonly supplierProductService: SupplierProductService,
    private readonly supplierLocationService: SupplierLocationService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.supplierProductService.getAll(filterQuery, page, size);
  }

  @Get('supplier-location/:supplierLocationId')
  async getBySupplierLocationId(
    @Param('supplierLocationId', new ParseObjectIdPipe()) supplierLocationId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = { supplierLocationId };

    return await this.supplierProductService.getAll(filterQuery, page, size);
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };

    return await this.supplierProductService.getDetail(filterQuery);
  }

  @Post()
  async create(
    @Body() supplierProductDto: SupplierProductDto
  ) {
    const supplierProduct = new Supplier_Product(supplierProductDto);
    supplierProduct.updateSupplierLocationId = supplierProductDto.supplierLocationId; // Set the supplierLocationId to the given id
    const supplierLocation = await this.supplierLocationService.getDetail({ _id: supplierProductDto.supplierLocationId });
    if (!supplierLocation) {
      throw new CustomBadRequestException('Supplier location không tồn tại');
    }
    supplierProduct.supplierLocationName = supplierLocation.name || '';

    return await this.supplierProductService.create(supplierProduct);
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() supplierProductDto: SupplierProductDto
  ) {
    const filterQuery = { _id: id };
    const supplierProduct = new Supplier_Product(supplierProductDto);
    supplierProduct.updateSupplierLocationId = id; // Set the supplierLocationId to the given id
    const supplierLocation = await this.supplierLocationService.getDetail({ _id: supplierProductDto.supplierLocationId });
    if (!supplierLocation) {
      throw new CustomBadRequestException('Supplier location không tồn tại');
    }

    supplierProduct.supplierLocationName = supplierLocation.name || '';
    return await this.supplierProductService.replace(filterQuery, supplierProduct);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() supplierProductDto: UpdateSupplierProductDto
  ) {
    const filterQuery = { _id: id };

    const data: Partial<Supplier_Product> = { ...supplierProductDto };

    const supplierLocationId = supplierProductDto.supplierLocationId;
    console.log(`supplierLocationId: `, supplierLocationId);

    if (supplierLocationId) {
      data.supplierLocationId = ObjectId.createFromHexString(supplierLocationId);
      const supplierLocation = await this.supplierLocationService.getDetail({ _id: supplierLocationId });
      if (!supplierLocation) {
        throw new CustomBadRequestException('Supplier location không tồn tại');
      }

      data.supplierLocationName = supplierLocation.name || '';
    }

    return await this.supplierProductService.modify(filterQuery, data);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };
    return await this.supplierProductService.remove(filterQuery);
  }
}