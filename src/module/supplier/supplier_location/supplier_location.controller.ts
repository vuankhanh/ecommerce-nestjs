import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SupplierLocationService } from './supplier_location.service';
import { SupplierLocationDto, UpdateSupplierLocationDto } from './dto/supplier_location.dto';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Supplier_Location } from './schema/supplier_location.schema';
import { SupplierDebtDto } from './dto/supplier_debt.dto';
import { ISupplierDebt } from 'src/shared/interface/supplier_location.interface';

@Controller('supplier')
@UseGuards(AuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class SupplierLocationController {
  constructor(
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
    return await this.supplierLocationService.getAll(filterQuery, page, size);
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };
    return await this.supplierLocationService.getDetail(filterQuery);
  }

  @Get(':id/debt')
  async getDebt(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };
    return await this.supplierLocationService.getDebt(filterQuery);
  }

  @Post()
  async create(
    @Body() supplierLocationDto: SupplierLocationDto
  ) {
    const supplier: Supplier_Location = new Supplier_Location(supplierLocationDto);
    return await this.supplierLocationService.create(supplier);
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() supplierLocationDto: SupplierLocationDto
  ) {
    const filterQuery = { _id: id };
    const supplier: Supplier_Location = new Supplier_Location(supplierLocationDto);
    return await this.supplierLocationService.replace(filterQuery, supplier);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() supplierLocationDto: UpdateSupplierLocationDto
  ) {
    const filterQuery = { _id: id };
    return await this.supplierLocationService.modify(filterQuery, supplierLocationDto);
  }

  @Patch(':id/debt/update')
  async updateDebt(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() supplierDebtDto: SupplierDebtDto
  ) {
    const filterQuery = { _id: id };
    return await this.supplierLocationService.updateDebt(filterQuery, supplierDebtDto);
  }

  @Patch(':id/debt/clear')
  async clearDebt(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };

    const debt: ISupplierDebt = {
      amount: 0,
      note: ''
    }
    
    return await this.supplierLocationService.updateDebt(filterQuery, debt);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };
    return await this.supplierLocationService.remove(filterQuery);
  }
}
