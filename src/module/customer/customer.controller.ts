import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { CustomerService } from './customer.service';
import { CustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { Customer } from './schema/customer.schema';
import { ParseObjectIdPipe } from 'src/shared/core/pipes/parse_objectId_array.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { CsvUtil } from 'src/shared/util/csv.util';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { PhoneNumberInputPipe } from 'src/shared/core/pipes/string.pipe';

//1. Guards: Được sử dụng để bảo vệ các slug.
//2.Interceptors: Được sử dụng để thay đổi hoặc mở rộng hành vi của các method.
//3. Pipes: Được sử dụng để biến đổi hoặc xác thực dữ liệu.
@Controller('customer')
@UseGuards(LocalAuthGuard)
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService
  ) { }

  @Get()
  async getAll(
    @Query('name', new PhoneNumberInputPipe()) nameOrPhoneNumber: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (nameOrPhoneNumber) filterQuery['$or'] = [
      { name: { $regex: nameOrPhoneNumber, $options: 'i' } },
      { phoneNumber: { $regex: nameOrPhoneNumber, $options: 'i' } }
    ];
    
    const metaData = await this.customerService.getAll(filterQuery, page, size);

    return metaData;
  }

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };
    return await this.customerService.getDetail(filterQuery);
  }

  @Post()
  async create(
    @Body() customerDto: CustomerDto
  ) {
    const customer: Customer = new Customer(customerDto);
    return await this.customerService.create(customer);
  }

  @Post('/upload-csv')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('csv', memoryStorageMulterOptions),
  )
  async uploadVcf(
    @UploadedFile() file: Express.Multer.File
  ) {
    const json = await CsvUtil.convertCsvToJson(file.buffer);
    const customers: Array<Customer> = CsvUtil.transformArrJsonContactToArrCustomer(json);
    const customerCol = await this.customerService.insertMany(customers);
    return customerCol;
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() customerDto: CustomerDto
  ) {
    const filterQuery = { _id: id };
    const customer: Customer = new Customer(customerDto);
    return await this.customerService.replace(filterQuery, customer);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() customerDto: UpdateCustomerDto
  ) {
    const filterQuery = { _id: id };
    const data: Partial<Customer> = customerDto;
    return await this.customerService.modify(filterQuery, data);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };
    return await this.customerService.remove(filterQuery);
  }
}
