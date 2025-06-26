import { Module } from '@nestjs/common';
import { MediaPromotionService } from './media-promotion.service';
import { MediaPromotionController } from './media-promotion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, albumSchema } from '../schema/album.schema';

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
  controllers: [MediaPromotionController],
  providers: [MediaPromotionService]
})
export class MediaPromotionModule { }
