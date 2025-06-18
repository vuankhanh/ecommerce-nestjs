import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';

@Controller()
@UseGuards(LocalAuthGuard)
export class ProductCategoryController {
  @Get()
  @Roles('admin')
  async getAll() {
    // Logic to get all product categories
    return { message: 'Get all product categories' };
  }
}
