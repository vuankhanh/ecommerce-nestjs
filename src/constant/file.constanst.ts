import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from 'multer';

import { IFileType } from "src/shared/interface/files.interface";
import { Request } from "express";
import { CustomBadRequestException } from "src/shared/core/exception/custom-exception";
import { PurposeOfMedia } from "./media.constant";

const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
  const urlCustomerUpload = '/customer/upload-csv';
  const matchMediaFile = ['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
  const matchContactFile = ['text/csv'];

  const match = req.url.includes(urlCustomerUpload) ? matchContactFile : matchMediaFile
  if (match.indexOf(file.mimetype) === -1) {
    return cb(new CustomBadRequestException('Kiểu tệp không hợp lệ'), false);
  }
  return cb(null, true);
}

export const memoryStorageMulterOptions: MulterOptions = {
  storage: multer.memoryStorage(),
  fileFilter
}

const imageEnums = ['webp', 'jpeg', 'png'] as const;
const videoEnums = ['mp4', 'quicktime', 'webm'] as const;

export const imageTypes: { [key in typeof imageEnums[number]]: IFileType } = {
  webp: {
    type: 'image/webp',
    extension: 'webp'
  },
  jpeg: {
    type: 'image/jpeg',
    extension: 'jpeg'
  },
  png: {
    type: 'image/png',
    extension: 'png'
  },
};

export const videoTypes: { [key in typeof videoEnums[number]]: IFileType } = {
  mp4: {
    type: 'video/mp4',
    extension: 'mp4'
  },
  quicktime: {
    type: 'video/quicktime',
    extension: 'mov'
  },
  webm: {
    type: 'video/webm',
    extension: 'webm'
  }
};


PurposeOfMedia

// Định nghĩa cho tôi kiểu của imageSize có các key là value của enums PurposeOfMedia
export type TImageSize = {
  [key in PurposeOfMedia]: {
    width: number;
    height: number;
  }
}
export const imageSize: TImageSize = {
  logo: {
    width: 500,
    height: 500
  },
  'slide-show': {
    width: 1920,
    height: 1080
  },
  promotion: {
    width: 1920,
    height: 1080
  },
  product: {
    width: 1920,
    height: 1080
  },
  'product-category': {
    width: 500,
    height: 500
  },
  post: {
    width: 1920,
    height: 1080
  },
  'post-category': {
    width: 500,
    height: 500
  }
}