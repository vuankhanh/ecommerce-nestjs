import { Module } from '@nestjs/common';
import { MediaLogoModule } from './media-logo/media-logo.module';
import { MediaBannerModule } from './media-banner/media-banner.module';
import { MediaPromotionModule } from './media-promotion/media-promotion.module';
import { MediaProductModule } from './media-product/media-product.module';
import { MediaProductCategoryModule } from './media-product-category/media-product-category.module';

@Module({
  imports: [
    MediaLogoModule,
    MediaBannerModule,
    MediaPromotionModule,
    MediaProductModule,
    MediaProductCategoryModule
  ],
  exports: [
    MediaLogoModule,
    MediaBannerModule,
    MediaPromotionModule,
    MediaProductModule,
    MediaProductCategoryModule
  ]
})
export class MediaModule {}
