import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductCategory, productCategorySchema } from 'src/shared/schema/product-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductCategory.name,
        schema: productCategorySchema,
        collection: ProductCategory.name.toLowerCase()
      }
    ])
  ],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController]
})
export class ProductCategoryModule { }
