import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { RouterModule } from '@nestjs/core';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    ProductModule,
    ProductCategoryModule,
    AlbumModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'product-category',
            module: ProductCategoryModule,
          },
          {
            path: 'product',
            module: ProductModule,
          },
          {
            path: 'album',
            module: AlbumModule
          }
        ]
      },
    ]),
  ]
})
export class AdminModule { }