import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { TLanguage } from "src/shared/interface/lang.interface";
import { IOrderItem } from "src/shared/interface/order.interface";
import { Product } from "src/shared/schema/product.schema";

@Schema({ timestamps: true })
export class OrderItem implements IOrderItem {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId()
  })
  _id?: Types.ObjectId;

  @Prop({ type: String, ref: Product.name, required: true })
  productId: string | Types.ObjectId;

  @Prop({ type: String, required: true })
  productThumbnail: string;

  @Prop({ type: String, required: true })
  productCode: string;

  @Prop({
    type: Object,
    required: true,
    validate: {
      validator: (pName: any) => pName && typeof pName.vi === 'string' && pName.vi.length > 0,
      message: 'Product Name phải có giá trị cho ngôn ngữ mặc định (vi)'
    }
  })
  productName: { [key in TLanguage]: string };

  @Prop({ type: String, required: true })
  productCategorySlug: string;

  @Prop({ type: String, required: true })
  productSlug: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total: number;
}