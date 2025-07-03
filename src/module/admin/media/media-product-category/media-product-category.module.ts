import { Module } from '@nestjs/common';
import { MediaProductCategoryController } from './media-product-category.controller';
import { MediaProductCategoryService } from './media-product-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, albumSchema } from '../../../../shared/schema/album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Album.name,
        schema: albumSchema,
        collection: Album.name.toLowerCase()
      }
    ])
  ],
  controllers: [MediaProductCategoryController],
  providers: [MediaProductCategoryService]
})
export class MediaProductCategoryModule { }
