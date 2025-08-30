import { Module } from '@nestjs/common';
import { SlideShowController } from './slide-show.controller';
import { SlideShowService } from './slide-show.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, albumSchema } from 'src/shared/schema/album.schema';

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
  controllers: [SlideShowController],
  providers: [SlideShowService],
})
export class SlideShowModule {}
