import { IDelivery } from 'src/shared/interface/delivery.interface';
import { IOrderDetailPopulated } from 'src/shared/interface/order-response.interface';
import { OrderItemEntity } from './order-item.entity';
import { TLanguage } from 'src/shared/interface/lang.interface';
import { Types } from 'mongoose';
import {
  ORDER_FROM_LABEL,
  ORDER_STATUS_LABEL,
} from 'src/constant/order.constant';
import { PAYMENT_METHOD_LABEL } from 'src/constant/payment.constant';
import { TOrderFrom, TOrderStatus } from 'src/shared/interface/order.interface';
import { TPaymentMethod } from 'src/shared/interface/payment.interface';
import { DeliveryEntity } from 'src/module/client/personal/address/entity/delivery.entity';

export class OrderItemPlainEntity
  implements Omit<OrderItemEntity, 'productName'>
{
  _id: string | Types.ObjectId;
  productId: string | Types.ObjectId;
  productThumbnail: string;
  productCode: string;
  productName: string;
  productCategorySlug: string;
  productSlug: string;
  quantity: number;
  price: number;
  total: number;
  constructor(orderItem: OrderItemEntity, lang: TLanguage) {
    this._id = orderItem._id;
    this.productId = orderItem.productId;
    this.productThumbnail = orderItem.productThumbnail;
    this.productCode = orderItem.productCode;
    this.productName = orderItem.productName[lang];
    this.productCategorySlug = orderItem.productCategorySlug;
    this.productSlug = orderItem.productSlug;
    this.quantity = orderItem.quantity;
    this.price = orderItem.price;
    this.total = orderItem.total;
  }
}
export class OrderPlainEntity
  implements
    Omit<
      IOrderDetailPopulated,
      'orderFrom' | 'orderItems' | 'status' | 'paymentMethod'
    >
{
  orderCode: string;
  orderItems: OrderItemPlainEntity[];
  orderFrom: string;
  status: string;
  reasonForCancellation?: string;
  subTotal: number;
  total: number;
  discount: number;
  deliveryFee: number;
  paymentMethod: string;
  lang: TLanguage;
  delivery: IDelivery;
  note: string;
  customerEmail: string;
  customerName: string;
  constructor(order: IOrderDetailPopulated, lang: TLanguage) {
    this.orderCode = order.orderCode;
    this.orderItems = OrderPlainEntity.getOrderItemsPlain(
      order.orderItems,
      lang,
    );
    this.orderFrom = OrderPlainEntity.getOrderFromPlain(order.orderFrom, lang);
    this.status = OrderPlainEntity.getOrderStatusPlain(order.status, lang);
    this.reasonForCancellation = order.reasonForCancellation;
    this.subTotal = order.subTotal;
    this.total = order.total;
    this.discount = order.discount;
    this.deliveryFee = order.deliveryFee;
    this.paymentMethod = OrderPlainEntity.getPaymentMethodPlain(
      order.paymentMethod,
      lang,
    );
    this.lang = order.lang;
    this.delivery = order.delivery;
    this.note = order.note;
    this.customerEmail = order.customerEmail;
    this.customerName = order.customerName;

    this.delivery['addressDetail'] = DeliveryEntity.generateAddressDetail(
      this.delivery.address,
    );
  }

  static getOrderItemsPlain(
    orderItems: OrderItemEntity[],
    lang: TLanguage,
  ): OrderItemPlainEntity[] {
    return orderItems.map((item) => new OrderItemPlainEntity(item, lang));
  }

  static getOrderFromPlain(orderFrom: TOrderFrom, lang: TLanguage): string {
    return ORDER_FROM_LABEL[orderFrom]?.[lang] || orderFrom;
  }

  static getOrderStatusPlain(
    orderStatus: TOrderStatus,
    lang: TLanguage,
  ): string {
    return ORDER_STATUS_LABEL[orderStatus]?.[lang] || orderStatus;
  }

  static getPaymentMethodPlain(
    orderPaymentMethod: TPaymentMethod,
    lang: TLanguage,
  ): string {
    return (
      PAYMENT_METHOD_LABEL[orderPaymentMethod]?.[lang] || orderPaymentMethod
    );
  }
}
