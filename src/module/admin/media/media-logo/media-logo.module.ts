import { Module } from '@nestjs/common';
import { MediaLogoController } from './media-logo.controller';
import { MediaLogoService } from './media-logo.service';
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
  controllers: [MediaLogoController],
  providers: [MediaLogoService]
})
export class MediaLogoModule { }
