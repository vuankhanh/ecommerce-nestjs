import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { AuthenticationProvider, UserRole } from "src/constant/user.constant";
import { IUser } from "src/shared/interface/user.interface";

export type AccountDocument = HydratedDocument<Account>;

@Schema({
  collection: 'account',
  timestamps: true
})
export class Account implements IUser {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
  })
  password?: string;

  @Prop({ type: String, default: false })
  hasPassword?: boolean;

  @Prop({ unique: true, sparse: true })
  googleId?: string;

  @Prop({ unique: true, sparse: true })
  facebookId?: string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({ type: String })
  avatar?: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: `${UserRole}`;

  @Prop({
    type: String,
    enum: AuthenticationProvider,
    default: AuthenticationProvider.LOCAL,
  })
  createdByProvider: `${AuthenticationProvider}`;

  constructor(
    email: string,
    name: string,
    avatar: string = '',
  ) {
    this.email = email;
    this.name = name;
    this.avatar = avatar;
    this.role = 'client';
    this.createdByProvider = 'local';
  }

  set updatePassword(password: string) {
    this.password = password;
    this.hasPassword = true;
  }

  set updateGoogleId(googleId: string) {
    this.googleId = googleId;
    this.createdByProvider = AuthenticationProvider.GOOGLE;
  }

  set updateFacebookId(facebookId: string) {
    this.facebookId = facebookId;
    this.createdByProvider = AuthenticationProvider.FACEBOOK;
  }
}

export const accountSchema = SchemaFactory.createForClass(Account);