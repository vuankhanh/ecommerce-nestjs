import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Album, AlbumDocument } from '../schema/album.schema';
import { Document, Types, FilterQuery, FlattenMaps, Model } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { IMedia } from 'src/shared/interface/media.interface';
import { Media } from '../schema/media.schema';


@Injectable()
export class MediaLogoService implements IBasicService<Album> {
  private albumFoler: string;
  constructor(
    @InjectModel(Album.name) private logoAlbumModel: Model<Album>,
    private configService: ConfigService
  ) {
    this.albumFoler = this.configService.get('folder.uploads');
  }

  async checkExistLogoAlbum() {
    const filterQuery: FilterQuery<Album> = { purposeOfMedia: 'logo' };
    return await this.logoAlbumModel.countDocuments(filterQuery);
  }

  async create(data: Album): Promise<AlbumDocument> {
    const newAlbum = new this.logoAlbumModel(data);
    return await newAlbum.save();
  }

  getAll(filterQuery: FilterQuery<Album>, page: number, size: number): Promise<{ data: FlattenMaps<AlbumDocument>[]; paging: IPaging; }> {
    throw new Error('Method not implemented.');
  }

  async getDetail(): Promise<AlbumDocument> {
    const filterQuery: FilterQuery<Album> = { purposeOfMedia: 'logo' };
    return await this.logoAlbumModel.findOne(filterQuery);
  }

  async getMainLogo(): Promise<FlattenMaps<Media>> {
    const filterQuery: FilterQuery<Album> = { purposeOfMedia: 'logo' };
    return await this.logoAlbumModel.findOne(filterQuery)
      .select('media thumbnailUrl')
      .populate('media', 'url thumbnailUrl')
      .then(album => {
        if (album && album.media.length > 0) {
          return album.media[0];
        }
        return null;
      });
  }

  replace(filterQuery: FilterQuery<Album>, data: Album): Promise<Document<unknown, {}, Album, {}> & Album & { _id: Types.ObjectId; } & { __v: number; }> {
    throw new Error('Method not implemented.');
  }

  modify(filterQuery: FilterQuery<Album>, data: Partial<Album>): Promise<Document<unknown, {}, Album, {}> & Album & { _id: Types.ObjectId; } & { __v: number; }> {
    throw new Error('Method not implemented.');
  }

  insert(data: Media): Promise<AlbumDocument> {
    //insert vào một album đã tồn tại
    const filterQuery: FilterQuery<Album> = { purposeOfMedia: 'logo' };
    //Thêm vào đầu mảng media

    return this.logoAlbumModel.findOneAndUpdate(
      filterQuery,
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

  remove(filterQuery: FilterQuery<Album>): Promise<AlbumDocument> {
    throw new Error('Method not implemented.');
  }


}
