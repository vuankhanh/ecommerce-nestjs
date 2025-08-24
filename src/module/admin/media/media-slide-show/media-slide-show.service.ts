import { Injectable } from '@nestjs/common';
import { IBasicAdminService } from 'src/shared/interface/basic_admin_service.interface';
import { Album, AlbumDocument } from '../../../../shared/schema/album.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, FlattenMaps, Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Media, MediaDocument } from '../../../../shared/schema/media.schema';
import { IPaging } from 'src/shared/interface/paging.interface';
import { PurposeOfMedia } from 'src/constant/media.constant';
import { IMedia } from 'src/shared/interface/media.interface';
import { FileHelper } from 'src/shared/helper/file.helper';
import { SortUtil } from 'src/shared/util/sort_util';
import { HydratedDocument } from 'mongoose';

@Injectable()
export class MediaSlideShowService implements IBasicAdminService<Album> {
  private albumFoler: string;
  private readonly filterQuery: FilterQuery<Album> = { purposeOfMedia: PurposeOfMedia.SLIDE_SHOW };
  constructor(
    @InjectModel(Album.name) private slideShowAlbumModel: Model<Album>,
    private configService: ConfigService
  ) {
    this.albumFoler = this.configService.get('folder.uploads');
  }

  async checkExistSlideShowAlbum() {
    return await this.slideShowAlbumModel.countDocuments(this.filterQuery);
  }

  async create(data: Album): Promise<HydratedDocument<Album>> {
    const newAlbum = new this.slideShowAlbumModel(data);
    return await newAlbum.save();
  }

  getAll(): Promise<{ data: FlattenMaps<AlbumDocument>[]; paging: IPaging; }> {
    throw new Error('Method not implemented.');
  }

  async getDetail(): Promise<AlbumDocument> {
    return await this.slideShowAlbumModel.findOne(this.filterQuery);
  }

  async replace(data: Album) {
    const slideShow = await this.slideShowAlbumModel.findOneAndUpdate(this.filterQuery, data, { new: true });
    return slideShow as unknown as AlbumDocument;
  }

  async addNewFiles(
    newFiles: Array<IMedia> = []
  ) {
    if (!newFiles.length) {
      throw new Error('No new files to add');
    }

    const updateQuery = {
      $push: {
        media: { $each: newFiles }
      }
    };

    return await this.slideShowAlbumModel.findOneAndUpdate(this.filterQuery, updateQuery, { safe: true, new: true });;
  }

  async removeFiles(
    filesWillRemove: Array<mongoose.Types.ObjectId> = [],
  ) {
    if (!filesWillRemove.length) {
      throw new Error('No files to remove');
    }

    const updateQuery = {
      $pull: {
        media: { _id: { $in: filesWillRemove } }
      }
    }

    //Lọc ra danh sách file cục bộ cần xóa
    await this.filterMediaItems(filesWillRemove).then(async mediaUrls => {
      //Xóa file
      try {
        await FileHelper.removeMediaFiles(this.albumFoler, mediaUrls);
      } catch (error) {
        console.log('Error removing media files:', error);
      }
    });

    return await this.slideShowAlbumModel.findOneAndUpdate(this.filterQuery, updateQuery, { safe: true, new: true });;
  }

  async itemIndexChange(itemIndexChanges: Array<string | mongoose.Types.ObjectId>) {
    const album = await this.slideShowAlbumModel.findOne(this.filterQuery);
    if (!album) {
      throw new Error('Album not found');
    }

    album.media = SortUtil.sortDocumentArrayByIndex<Media>(album.media as Array<MediaDocument>, itemIndexChanges);

    return await album.save();;
  }

  async modify(data: Partial<Album>) {

    const slideShow = await this.slideShowAlbumModel.findOneAndUpdate(this.filterQuery, data, { new: true });
    return slideShow as unknown as AlbumDocument;
  }

  async remove(): Promise<AlbumDocument> {
    const slideShow = await this.slideShowAlbumModel.findOneAndDelete(this.filterQuery);
    if (slideShow?.relativePath) {
      try {
        await FileHelper.removeFolder(this.albumFoler, slideShow.relativePath);
      } catch (error) {
        console.error('Error removing folder:', error);
      }
    }

    return await this.slideShowAlbumModel.findOneAndDelete(this.filterQuery);
  }

  async filterMediaItems(itemIds: Array<mongoose.Types.ObjectId | string>): Promise<Array<{ url: string, thumbnailUrl: string }>> {
    return this.slideShowAlbumModel.aggregate([
      { $match: this.filterQuery },
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
