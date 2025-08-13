import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Album, AlbumDocument } from '../../../../shared/schema/album.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FilterQuery, FlattenMaps, HydratedDocument, Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IPaging } from 'src/shared/interface/paging.interface';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { FileHelper } from 'src/shared/helper/file.helper';
import { Media } from '../../../../shared/schema/media.schema';

@Injectable()
export class MediaPromotionService implements IBasicService<Album> {
  private albumFoler: string;
  private readonly filterQuery: FilterQuery<Album> = { purposeOfMedia: PurposeOfMedia.PROMOTION };
  constructor(
    @InjectModel(Album.name) private promotionAlbumModel: Model<Album>,
    private configService: ConfigService
  ) {
    this.albumFoler = this.configService.get('folder.uploads');
  }

  async checkExistPromotionAlbum() {
    return await this.promotionAlbumModel.countDocuments(this.filterQuery);
  }

  async create(data: Album): Promise<HydratedDocument<Album>> {
    const createdAlbum = new this.promotionAlbumModel(data);
    return createdAlbum.save();
  }

  async getAll(): Promise<{ data: FlattenMaps<AlbumDocument>[]; paging: IPaging; }> {
    throw new Error('Method not implemented.');
  }

  async getDetail(): Promise<AlbumDocument> {
    return this.promotionAlbumModel.findOne(this.filterQuery);
  }

  async getMainLogo(): Promise<FlattenMaps<Media>> {
    return await this.promotionAlbumModel.findOne(this.filterQuery)
      .select('media thumbnailUrl')
      .populate('media', 'url thumbnailUrl')
      .then(album => {
        const mainMediaIndex = album?.mainMedia || 0;
        if (album && album.media.length > 0) {
          return album.media[mainMediaIndex];
        }
        return null;
      });
  }

  async replace(data: Album): Promise<AlbumDocument> {
    const slideShow = this.promotionAlbumModel.findOneAndReplace(this.filterQuery, data, { new: true }).exec();
    return slideShow as unknown as AlbumDocument;
  }

  async modify(data: Partial<Album>): Promise<AlbumDocument> {
    const slideShow =  this.promotionAlbumModel.findOneAndUpdate(this.filterQuery, data, { new: true }).exec();
    return slideShow as unknown as AlbumDocument;
  }

  async insert(data: Media): Promise<AlbumDocument> {
    return await this.promotionAlbumModel.findOneAndUpdate(
      this.filterQuery,
      {
        $push: {
          media: {
            $each: [data],
            $position: 0
          }
        },
        $set: {
          mainMedia: 0,
          thumbnailUrl: data.thumbnailUrl
        }
      },
      { new: true, upsert: true }
    );
  }

  async remove(): Promise<AlbumDocument> {
    const slideShow = await this.promotionAlbumModel.findOne(this.filterQuery)
    if (slideShow?.relativePath) {
      await FileHelper.removeFolder(this.albumFoler, slideShow.relativePath);
    }
    return slideShow as unknown as AlbumDocument;
  }

}
