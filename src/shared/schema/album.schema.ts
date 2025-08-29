import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Media } from "./media.schema";
import { IAlbum } from "src/shared/interface/media.interface";
import { PurposeOfMedia } from "src/constant/media.constant";

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album implements IAlbum {
  @Prop({
    type: String,
    required: true,
    unique: true
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true
  })
  slug: string;

  @Prop({
    type: String,
    enum: Object.values(PurposeOfMedia),
    required: true
  })
  purposeOfMedia: `${PurposeOfMedia}`;

  @Prop({
    type: Array<Media>
  })
  media: Array<Media>;

  @Prop({
    type: String,
    required: true
  })
  relativePath: string;

  @Prop({
    type: String,
    required: true,
  })
  thumbnailUrl: string;

  @Prop({
    type: Number,
    default: 0
  })
  mainMedia: number;

  constructor(album: IAlbum) {
    this.name = album.name;
    this.slug = album.slug;
    this.purposeOfMedia = album.purposeOfMedia;
    this.media = album.media;
    this.relativePath = album.relativePath;
    this.thumbnailUrl = album.thumbnailUrl;
    this.mainMedia = album.mainMedia;
  }
}

export const albumSchema = SchemaFactory.createForClass(Album);

// Gộp chung các giá trị unique vào 1 index
albumSchema.index(
  { purposeOfMedia: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { 
      purposeOfMedia: { 
        $in: [
          PurposeOfMedia.LOGO, 
          PurposeOfMedia.SLIDE_SHOW, 
          PurposeOfMedia.PROMOTION
        ] 
      } 
    }
  }
);