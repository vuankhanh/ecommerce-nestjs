import { CustomerLevel } from 'src/constant/customer.constant';

export interface ICustomer {
  name: string;
  phoneNumber: string;
  address?: string;
  email?: string;
  dob?: string;
  company?: string;
  note?: string;
  level?: ICustomerLevel;
}

export type ICustomerLevel = `${CustomerLevel}`;
