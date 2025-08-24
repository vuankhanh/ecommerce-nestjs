import { Injectable } from '@nestjs/common';
import { IBasicAdminService } from 'src/shared/interface/basic_admin_service.interface';
import { Album, AlbumDocument } from '../../../../shared/schema/album.schema';
import { Document, Types, FilterQuery, FlattenMaps, Model, HydratedDocument } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { IMedia } from 'src/shared/interface/media.interface';
import { Media } from '../../../../shared/schema/media.schema';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { FileHelper } from 'src/shared/helper/file.helper';


@Injectable()
export class MediaLogoService implements IBasicAdminService<Album> {
  private albumFoler: string;
  private readonly filterQuery: FilterQuery<Album> = { purposeOfMedia: PurposeOfMedia.LOGO };
  constructor(
    @InjectModel(Album.name) private logoAlbumModel: Model<Album>,
    private configService: ConfigService
  ) {
    this.albumFoler = this.configService.get('folder.uploads');
  }

  async checkExistLogoAlbum() {
    return await this.logoAlbumModel.countDocuments(this.filterQuery);
  }

  async create(data: Album): Promise<HydratedDocument<Album>> {
    const newAlbum = new this.logoAlbumModel(data);
    return await newAlbum.save();
  }

  getAll(): Promise<{ data: FlattenMaps<AlbumDocument>[]; paging: IPaging; }> {
    throw new Error('Method not implemented.');
  }

  async getDetail(): Promise<AlbumDocument> {
    return await this.logoAlbumModel.findOne(this.filterQuery);
  }

  async getMainLogo(): Promise<FlattenMaps<Media>> {
    return await this.logoAlbumModel.findOne(this.filterQuery)
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

  replace(filterQuery: FilterQuery<Album>, data: Album): Promise<AlbumDocument> {
    throw new Error('Method not implemented.');
  }

  modify(filterQuery: FilterQuery<Album>, data: Partial<Album>): Promise<AlbumDocument> {
    throw new Error('Method not implemented.');
  }

  async insert(data: Media): Promise<AlbumDocument> {
    return await this.logoAlbumModel.findOneAndUpdate(
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
    const album = await this.logoAlbumModel.findOne(this.filterQuery)
    if (album?.relativePath) {
      await FileHelper.removeFolder(this.albumFoler, album.relativePath);
    }
    return album as unknown as AlbumDocument;
  }
}
