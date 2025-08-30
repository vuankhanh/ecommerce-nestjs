import { Injectable } from '@nestjs/common';

import * as sharp from 'sharp';

@Injectable()
export class ImageConverterUtil {
  constructor() {}

  static async resize(
    file: Express.Multer.File,
    size: { width: number; height: number },
  ): Promise<Buffer> {
    if (!file.buffer) return Promise.reject('File buffer is empty');
    return await sharp(file.buffer)
      .rotate()
      .resize(size.width, size.height)
      .webp()
      .toBuffer();
  }

  static async thumbnail(buffer: Buffer, sizeWidth: number): Promise<Buffer> {
    return await sharp(buffer)
      .resize({ width: sizeWidth })
      .withMetadata()
      .toBuffer();
  }
}
