import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { TProcessedMedia } from '../../interface/files.interface';
import { MediaProcessUtil } from '../../util/media_process.util';
import { CustomInternalServerErrorException } from '../exception/custom-exception';

@Injectable({
  scope: Scope.REQUEST,
})
export class FileProcessPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request
  ) {}
  async transform(file: Express.Multer.File): Promise<TProcessedMedia> {
    try {
      const customParams = this.request['customParams'];
      const mediaType = customParams.purposeOfMedia;
      return file.mimetype.includes('image') ? await MediaProcessUtil.processImage(file, mediaType) : await MediaProcessUtil.originalVideo(file);
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message || error);
    }
  }
}

@Injectable()
export class FilesProcessPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request
  ) {}
  async transform(files: Express.Multer.File[]): Promise<Array<TProcessedMedia>> {
    try {
      const customParams = this.request['customParams'];
      const mediaType = customParams.relativePath;
      return await Promise.all(
        files.map(async file=>{
          return file.mimetype.includes('image') ? await MediaProcessUtil.processImage(file, mediaType) : await MediaProcessUtil.originalVideo(file);
        })
      )
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message || error);
    }
  }
}