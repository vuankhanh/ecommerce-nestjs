import { MediaFormat, PurposeOfMedia } from 'src/constant/media.constant';

export interface IAlbum {
  name: string;
  slug: string;
  purposeOfMedia: `${PurposeOfMedia}`;
  media: IMedia[];
  relativePath: string;
  thumbnailUrl: string;
  mainMedia: number;
}

export interface IMedia {
  url: string;
  thumbnailUrl: string;
  name: string;
  description: string;
  alternateName: string;
  type: `${MediaFormat}`;
}
