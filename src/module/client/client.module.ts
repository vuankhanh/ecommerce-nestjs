import { Module } from '@nestjs/common';

import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { SlideShowModule } from './slide-show/slide-show.module';
import { PersonalModule } from './personal/personal.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ProductModule,
    ProductCategoryModule,
    SlideShowModule,
    PersonalModule,
    OrderModule
  ],
})
export class ClientModule {}