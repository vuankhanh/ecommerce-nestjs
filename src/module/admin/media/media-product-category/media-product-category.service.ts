import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Album, AlbumDocument } from '../schema/album.schema';
import mongoose, { Document, FilterQuery, FlattenMaps, Model, Types } from 'mongoose';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { IPaging } from 'src/shared/interface/paging.interface';
import { FileHelper } from 'src/shared/helper/file.helper';
import { Media, MediaDocument } from '../schema/media.schema';
import { SortUtil } from 'src/shared/util/sort_util';

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

  async addNewFiles(filterQuery: FilterQuery<Album>, data: Media): Promise<AlbumDocument> {
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

  async removeFiles(
    filterQuery: FilterQuery<Album>,
    filesWillRemove: Array<mongoose.Types.ObjectId> = [],
  ) {
    if (!filesWillRemove.length) {
      throw new Error('No files to remove');
    }

    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;

    const updateQuery = {
      $pull: {
        media: { _id: { $in: filesWillRemove } }
      }
    }

    //Lọc ra danh sách file cục bộ cần xóa
    await this.filterMediaItems(filterQuery, filesWillRemove).then(async mediaUrls => {
      //Xóa file
      await FileHelper.removeMediaFiles(this.albumFoler, mediaUrls);
    });

    return await this.productCategoryAlbumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });;
  }

  async itemIndexChange(filterQuery: FilterQuery<Album>, itemIndexChanges: Array<string | mongoose.Types.ObjectId>) {
    const album = await this.productCategoryAlbumModel.findOne(filterQuery);
    if (!album) {
      throw new Error('Album not found');
    }

    album.media = SortUtil.sortDocumentArrayByIndex<Media>(album.media as Array<MediaDocument>, itemIndexChanges);

    return await album.save();;
  }

  modify(filterQuery: FilterQuery<Album>, data: Partial<Album>): Promise<Document<unknown, {}, Album, {}> & Album & { _id: Types.ObjectId; } & { __v: number; }> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    throw new Error('Method not implemented.');
  }

  async remove(filterQuery: FilterQuery<Album>): Promise<AlbumDocument> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT_CATEGORY;
    const album = await this.productCategoryAlbumModel.findOne(filterQuery)
    if (album?.relativePath) {
      await FileHelper.removeFolder(this.albumFoler, album.relativePath);
    }
    return album;
  }

  async filterMediaItems(filterQuery: FilterQuery<Album>, itemIds: Array<mongoose.Types.ObjectId | string>): Promise<Array<{ url: string, thumbnailUrl: string }>> {
    return this.productCategoryAlbumModel.aggregate([
      { $match: filterQuery },
      {
        $project: {
          media: {
            $filter: {
              input: '$media',
              as: 'item',
              cond: { $in: ['$$item._id', itemIds.map(id => new Types.ObjectId(id))] }
            }
          }
        }
      },
      {
        $project: {
          media: {
            $map: {
              input: '$media',
              as: 'item',
              in: { url: '$$item.url', thumbnailUrl: '$$item.thumbnailUrl' }
            }
          }
        }
      }
    ]).then(res => {
      return res[0] ? res[0].media : [];
    });
  }
}
