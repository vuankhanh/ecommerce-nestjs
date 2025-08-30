import { Module } from '@nestjs/common';
import { MediaLogoModule } from './media-logo/media-logo.module';
import { MediaPromotionModule } from './media-promotion/media-promotion.module';
import { MediaSlideShowModule } from './media-slide-show/media-slide-show.module';
import { MediaProductModule } from './media-product/media-product.module';
import { MediaProductCategoryModule } from './media-product-category/media-product-category.module';

@Module({
  imports: [
    MediaLogoModule,
    MediaPromotionModule,
    MediaSlideShowModule,
    MediaProductModule,
    MediaProductCategoryModule,
  ],
  exports: [
    MediaLogoModule,
    MediaPromotionModule,
    MediaSlideShowModule,
    MediaProductModule,
    MediaProductCategoryModule,
  ],
})
export class MediaModule {}
