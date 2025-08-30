import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { Album, AlbumDocument } from 'src/shared/schema/album.schema';

@Injectable()
export class SlideShowService {
  private readonly filterQuery: FilterQuery<Album> = {
    purposeOfMedia: PurposeOfMedia.SLIDE_SHOW,
  };
  constructor(
    @InjectModel(Album.name) private slideShowAlbumModel: Model<Album>,
  ) {}

  async getDetail(): Promise<AlbumDocument> {
    return await this.slideShowAlbumModel.findOne(this.filterQuery);
  }
}
