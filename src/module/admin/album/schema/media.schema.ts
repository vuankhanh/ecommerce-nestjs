import { Prop, Schema } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MediaFormat } from "src/constant/media.constant";
import { IMedia } from "src/shared/interface/media.interface";

export type MediaDocument = HydratedDocument<Media>;

@Schema({
  timestamps: true
})
export class Media implements IMedia {
  @Prop({
    type: String,
    required: true,
  })
  url: string;

  @Prop({
    type: String,
    required: true
  })
  thumbnailUrl: string;

  @Prop({
    type: String,
    required: true
  })
  name: string;

  @Prop({
    type: String
  })
  description: string;

  @Prop({
    type: String
  })
  alternateName: string;

  @Prop({
    type: String,
    enum: MediaFormat,
    required: true
  })
  type: `${MediaFormat}`;
}