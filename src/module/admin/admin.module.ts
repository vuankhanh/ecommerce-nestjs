import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { RouterModule } from '@nestjs/core';
import { MediaModule } from './media/media.module';
import { MediaLogoModule } from './media/media-logo/media-logo.module';
import { MediaSlideShowModule } from './media/media-slide-show/media-slide-show.module';
import { MediaPromotionModule } from './media/media-promotion/media-promotion.module';
import { MediaProductModule } from './media/media-product/media-product.module';
import { MediaProductCategoryModule } from './media/media-product-category/media-product-category.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ProductModule,
    ProductCategoryModule,
    MediaModule,
    OrderModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'order',
            module: OrderModule,
          },
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
                path: 'slide-show',
                module: MediaSlideShowModule,
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
              },
            ],
          },
        ],
      },
    ]),
  ],
})
export class AdminModule {}
