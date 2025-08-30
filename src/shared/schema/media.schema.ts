import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MediaFormat } from 'src/constant/media.constant';
import { IMedia } from 'src/shared/interface/media.interface';

export type MediaDocument = HydratedDocument<Media>;

@Schema({
  timestamps: true,
})
export class Media implements IMedia {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id?: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  url: string;

  @Prop({
    type: String,
    required: true,
  })
  thumbnailUrl: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
  })
  alternateName: string;

  @Prop({
    type: String,
    enum: Object.values(MediaFormat),
    required: true,
  })
  type: `${MediaFormat}`;

  constructor(media: IMedia) {
    this._id = new Types.ObjectId();
    this.url = media.url;
    this.thumbnailUrl = media.thumbnailUrl;
    this.name = media.name;
    this.description = media.description || '';
    this.alternateName = media.alternateName || '';
    this.type = media.type;
  }
}
