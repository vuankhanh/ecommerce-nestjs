import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product_Category, productCategorySchema } from 'src/shared/schema/product-category.schema';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product_Category.name,
        schema: productCategorySchema,
        collection: Product_Category.name.toLowerCase()
      }
    ])
  ],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController],
  exports: [ProductCategoryService]
})
export class ProductCategoryModule { }
