import { Module } from '@nestjs/common';
import { MediaProductController } from './media-product.controller';
import { MediaProductService } from './media-product.service';
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
  controllers: [MediaProductController],
  providers: [MediaProductService]
})
export class MediaProductModule { }
