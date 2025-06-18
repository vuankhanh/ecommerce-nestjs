import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';

@Module({
  imports: [
    ProductModule,
    ProductCategoryModule
  ]
})
export class AdminModule {}
