import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { RouterModule } from '@nestjs/core';
import { MediaModule } from './media/media.module';
import { MediaLogoModule } from './media/media-logo/media-logo.module';
import { MediaBannerModule } from './media/media-banner/media-banner.module';
import { MediaPromotionModule } from './media/media-promotion/media-promotion.module';
import { MediaProductModule } from './media/media-product/media-product.module';
import { MediaProductCategoryModule } from './media/media-product-category/media-product-category.module';

@Module({
  imports: [
    ProductModule,
    ProductCategoryModule,
    MediaModule,
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
            path: 'media',
            module: MediaModule,
            children: [
              {
                path: 'logo',
                module: MediaLogoModule,
              },
              {
                path: 'banner',
                module: MediaBannerModule,
              },
              {
                path: 'promotion',
                module: MediaPromotionModule,
              },
              {
                path: 'product',
                module: MediaProductModule,
              },
              {
                path: 'product-category',
                module: MediaProductCategoryModule,
              }
            ]
          }
        ]
      },
    ]),
  ]
})
export class AdminModule { }