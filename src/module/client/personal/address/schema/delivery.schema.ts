import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { validatePhoneNumber } from 'src/shared/custom-validator/vietnamese-phone-number.validator';
import { IAddress } from 'src/shared/interface/address.interface';
import { IDelivery } from 'src/shared/interface/delivery.interface';
import { Account } from 'src/module/auth/schemas/account.schema';

export type DeliveryDocument = HydratedDocument<Delivery>;

@Schema({
  timestamps: true,
})
export class Delivery implements IDelivery {
  @Prop({ type: Types.ObjectId, required: true, ref: Account.name })
  accountId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (phone: string) {
        return validatePhoneNumber(phone);
      },
      message: 'Invalid phone number format',
    },
  })
  phoneNumber: string;

  @Prop({ type: Object, required: true })
  address: IAddress;

  @Prop({ type: String, required: true })
  addressDetail: string;

  @Prop({ type: Boolean, default: false })
  isDefault?: boolean;
}

export const delivertySchema = SchemaFactory.createForClass(Delivery);

// Index để đảm bảo chỉ có 1 địa chỉ mặc định per account
delivertySchema.index(
  { accountId: 1, isDefault: 1 },
  {
    unique: true,
    partialFilterExpression: { isDefault: true },
  },
);
