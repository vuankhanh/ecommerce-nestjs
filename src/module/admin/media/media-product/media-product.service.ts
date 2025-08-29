import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../../../../shared/schema/album.schema';
import mongoose, { FilterQuery, FlattenMaps, HydratedDocument, Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { Media, MediaDocument } from '../../../../shared/schema/media.schema';
import { FileHelper } from 'src/shared/helper/file.helper';
import { SortUtil } from 'src/shared/util/sort_util';

@Injectable()
export class MediaProductService {
  private albumFoler: string;
  constructor(
    @InjectModel(Album.name) private productAlbumModel: Model<Album>,
    private configService: ConfigService
  ) {
    this.albumFoler = this.configService.get('folder.uploads');
  }

  async checkExistProductAlbum(filterQuery: FilterQuery<Album>): Promise<number> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;
    return await this.productAlbumModel.countDocuments(filterQuery);
  }

  async create(data: Album): Promise<HydratedDocument<Album>> {
    const newAlbum = new this.productAlbumModel(data);
    return await newAlbum.save();
  }

  async getAll(filterQuery: FilterQuery<Album>, page: number, size: number) {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;
    const countTotal = await this.productAlbumModel.countDocuments(filterQuery);
    const albumsAggregate = await this.productAlbumModel.aggregate(
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
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;
    return await this.productAlbumModel.findOne(filterQuery);
  }

  async getMainProduct(filterQuery: FilterQuery<Album>): Promise<FlattenMaps<Media>> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;
    return await this.productAlbumModel.findOne(filterQuery)
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
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;
    throw new Error('Method not implemented.');
  }

  async addNewFiles(filterQuery: FilterQuery<Album>, data: Media[]): Promise<AlbumDocument> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;
    return await this.productAlbumModel.findOneAndUpdate(
      filterQuery,
      {
        $push: {
          media: {
            $each: data,
            $position: 0
          }
        },
        $set: {
          mainMedia: 0,
          thumbnailUrl: data[0].thumbnailUrl
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

    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;

    const updateQuery = {
      $pull: {
        media: { _id: { $in: filesWillRemove } }
      }
    }

    //Lọc ra danh sách file cục bộ cần xóa
    await this.filterMediaItems(filterQuery, filesWillRemove).then(async mediaUrls => {
      //Xóa file
      try {
        await FileHelper.removeMediaFiles(this.albumFoler, mediaUrls);
      } catch (error) {
        console.log('Error removing media files:', error);
      }
    });

    return await this.productAlbumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });
  }

  async itemIndexChange(filterQuery: FilterQuery<Album>, itemIndexChanges: Array<string | mongoose.Types.ObjectId>) {
    const album = await this.productAlbumModel.findOne(filterQuery);
    if (!album) {
      throw new Error('Album not found');
    }

    album.media = SortUtil.sortDocumentArrayByIndex<Media>(album.media as Array<MediaDocument>, itemIndexChanges);

    return await album.save();
  }

  modify(filterQuery: FilterQuery<Album>, data: Partial<Album>): Promise<AlbumDocument> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;
    throw new Error('Method not implemented.');
  }

  async remove(filterQuery: FilterQuery<Album>): Promise<AlbumDocument> {
    filterQuery.purposeOfMedia = PurposeOfMedia.PRODUCT;
    const album = await this.productAlbumModel.findOne(filterQuery)
    if (album?.relativePath) {
      try {
        await FileHelper.removeFolder(this.albumFoler, album.relativePath);
      } catch (error) {
        console.error('Error removing folder:', error);
      }
    }
    return await this.productAlbumModel.findOneAndDelete(filterQuery);
  }

  async filterMediaItems(filterQuery: FilterQuery<Album>, itemIds: Array<mongoose.Types.ObjectId | string>): Promise<Array<{ url: string, thumbnailUrl: string }>> {
    return this.productAlbumModel.aggregate([
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
