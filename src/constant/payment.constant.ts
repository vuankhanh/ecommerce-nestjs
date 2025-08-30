import { TPaymentMethod } from 'src/shared/interface/payment.interface';
import { TLanguage } from 'src/shared/interface/lang.interface';

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  PENDING = 'PENDING',
}

export const PAYMENT_METHOD_LABEL: Record<
  TPaymentMethod,
  Record<TLanguage, string>
> = {
  CASH: { vi: 'Tiền mặt', en: 'Cash', ja: '現金' },
  TRANSFER: { vi: 'Chuyển khoản', en: 'Transfer', ja: '振込' },
  PENDING: { vi: 'Chưa xác định', en: 'Pending', ja: '保留中' },
};
