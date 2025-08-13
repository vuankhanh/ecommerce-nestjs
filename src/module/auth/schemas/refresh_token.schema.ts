import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Account } from "./account.schema";

@Schema({
  collection: 'user_token',
  timestamps: true
})
export class RefreshToken {
  @Prop({ type: [Types.ObjectId, String], required: true, unique: true, ref: Account.name })
  accountId: Types.ObjectId | string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  constructor(accountId: Types.ObjectId | string, token: string, expiresAt: Date) {
    this.accountId = accountId;
    this.token = token;
    this.expiresAt = expiresAt;
  }
}

export const refreshTokenSchema = SchemaFactory.createForClass(RefreshToken);