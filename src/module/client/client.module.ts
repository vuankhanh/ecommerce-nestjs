import { Module } from '@nestjs/common';

import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { SlideShowModule } from './slide-show/slide-show.module';

@Module({
  imports: [
    ProductModule,
    ProductCategoryModule,
    SlideShowModule,
  ],
})
export class ClientModule {}