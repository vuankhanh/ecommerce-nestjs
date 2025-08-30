import { UserRole } from 'src/constant/user.constant';
import {
  OrderUpdateDto,
  OrderUpdateStatusDto,
} from 'src/shared/dto/order-update.dto';

const dto1 = new OrderUpdateDto();
const dto2 = new OrderUpdateStatusDto();
const merged = { ...dto1, ...dto2 };
export class OrderChangeHistoryEntity {
  changedAt: Date;
  changedBy: {
    userId: string;
    userType: `${UserRole}`;
  };
  changes: {};
}
