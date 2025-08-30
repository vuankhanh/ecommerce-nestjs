import { IOrderItemsRequest } from '../interface/order-request.interface';

export const validateOrderItems = (orderItems: IOrderItemsRequest[]) => {
  return (
    Array.isArray(orderItems) &&
    orderItems.length > 0 &&
    orderItems.every(
      (item) =>
        typeof item.quantity === 'number' && typeof item.productId === 'string',
    )
  );
};
