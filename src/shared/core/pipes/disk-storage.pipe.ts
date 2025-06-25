import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TProcessedMedia } from '../../interface/files.interface';
import { IMedia } from '../../interface/media.interface';
import { DiskStorageUtil } from '../../util/disk_storage.util';
import { Request } from 'express';

@Injectable({
  scope: Scope.REQUEST,
})
export class DiskStoragePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request
  ) { }
  transform(
    processedMedia: TProcessedMedia | TProcessedMedia[]
  ): IMedia | Array<IMedia> {
    const body = this.request.body;
    if(Array.isArray(processedMedia)){
      const arryObject = Object.keys(body)
      return processedMedia.map((media, index) => this.saveToDisk(media, arryObject[index]));
    }else{
      return this.saveToDisk(processedMedia, body.file_0);
    }
  }

  private saveToDisk(processedMedia: TProcessedMedia, fileInfo: any): IMedia {
    console.log(this.request.body);
    
    const customParams = this.request['customParams'];
    const destination = customParams.uploadsFolder;
    
    const relativePath = customParams.relativePath;

    const absolutePath = destination + '/' + relativePath;

    const file = processedMedia.file;
    
    DiskStorageUtil.saveToDisk(absolutePath, file);

    const thumbnail = processedMedia.thumbnail;
    DiskStorageUtil.saveToDisk(absolutePath, thumbnail);

    const media: IMedia = {
      url: relativePath + '/' + file.originalname,
      thumbnailUrl: relativePath + '/' + thumbnail.originalname,
      name: file.originalname,
      description: fileInfo.description || '',
      alternateName: fileInfo.alternateName || '',
      type: file.mimetype.includes('image') ? 'image' : 'video',
    }

    return media;
  }
}
