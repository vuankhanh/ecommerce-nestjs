import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Album, AlbumDocument } from '../schema/album.schema';
import { Document, FilterQuery, FlattenMaps, Model, Types } from 'mongoose';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { IPaging } from 'src/shared/interface/paging.interface';
import { FileHelper } from 'src/shared/helper/file.helper';
import { Media } from '../schema/media.schema';

@Injectable()
export class MediaProductCategoryService implements IBasicService<Album> {
  private albumFoler: string;
  constructor(
    @InjectModel(Album.name) private productCategoryAlbumModel: Model<Album>,
    private configService: ConfigService
  ) {
    this.albumFoler = this.configService.get('folder.uploads');
  }

  async checkExistProductCategoryAlbum(filterQuery: FilterQuery<Album>): Promise<number> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    return await this.productCategoryAlbumModel.countDocuments(filterQuery);
  }

  async create(data: Album): Promise<AlbumDocument> {
    const newAlbum = new this.productCategoryAlbumModel(data);
    return await newAlbum.save();
  }

  async getAll(filterQuery: FilterQuery<Album>, page: number, size: number) {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    const countTotal = await this.productCategoryAlbumModel.countDocuments(filterQuery);
    const albumsAggregate = await this.productCategoryAlbumModel.aggregate(
      [
        { $match: filterQuery },
        {
          $project: {
            media: 0
          }
        },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: albumsAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Album>): Promise<AlbumDocument> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    return await this.productCategoryAlbumModel.findOne(filterQuery);
  }

  async getMainProductCategory(filterQuery: FilterQuery<Album>): Promise<FlattenMaps<Media>> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    return await this.productCategoryAlbumModel.findOne(filterQuery)
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

  replace(filterQuery: FilterQuery<Album>, data: Album): Promise<Document<unknown, {}, Album, {}> & Album & { _id: Types.ObjectId; } & { __v: number; }> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    throw new Error('Method not implemented.');
  }

  modify(filterQuery: FilterQuery<Album>, data: Partial<Album>): Promise<Document<unknown, {}, Album, {}> & Album & { _id: Types.ObjectId; } & { __v: number; }> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    throw new Error('Method not implemented.');
  }

  async insert(filterQuery: FilterQuery<Album>, data: Media): Promise<AlbumDocument> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    return await this.productCategoryAlbumModel.findOneAndUpdate(
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

  async remove(filterQuery: FilterQuery<Album>): Promise<AlbumDocument> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    const album = await this.productCategoryAlbumModel.findOne(filterQuery)
    if (album?.relativePath) {
      await FileHelper.removeFolder(this.albumFoler, album.relativePath);
    }
    return album;
  }
}
