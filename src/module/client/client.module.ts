import { Module } from '@nestjs/common';

import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { SlideShowModule } from './slide-show/slide-show.module';
import { PersonalModule } from './personal/personal.module';

@Module({
  imports: [
    ProductModule,
    ProductCategoryModule,
    SlideShowModule,
    PersonalModule
  ],
})
export class ClientModule {}