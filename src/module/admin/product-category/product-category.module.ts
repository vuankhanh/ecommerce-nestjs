import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Product_Category,
  productCategorySchema,
} from 'src/shared/schema/product-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product_Category.name,
        schema: productCategorySchema,
        collection: Product_Category.name.toLowerCase(),
      },
    ]),
  ],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController],
})
export class ProductCategoryModule {}
