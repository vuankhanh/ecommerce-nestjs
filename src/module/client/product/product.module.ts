import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/shared/schema/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
        collection: Product.name.toLowerCase(),
      },
    ]),
    ProductCategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
