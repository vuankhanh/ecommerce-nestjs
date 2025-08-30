import { Module } from '@nestjs/common';
import { MediaSlideShowService } from './media-slide-show.service';
import { MediaSlideShowController } from './media-slide-show.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, albumSchema } from '../../../../shared/schema/album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Album.name,
        schema: albumSchema,
        collection: Album.name.toLowerCase(),
      },
    ]),
  ],
  providers: [MediaSlideShowService],
  controllers: [MediaSlideShowController],
})
export class MediaSlideShowModule {}
