import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ICustomer, ICustomerLevel } from "../../../shared/interface/customer.interface";
import { CustomerLevel } from "src/constant/customer.constant";
import { PartialType } from "@nestjs/mapped-types";

export class CustomerDto implements ICustomer {
  @IsNotEmpty({ message: 'The customer name is required' })
  @IsString({ message: 'The customer name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'The customer phoneNumber is required' })
  @IsString({ message: 'The customer phoneNumber must be a string' })
  phoneNumber: string;

  @IsOptional()
  @IsEmail({}, { message: 'The customer email must be a string' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'The customer dob must be a string' })
  dob?: string;

  @IsNotEmpty({ message: 'The customer address is required' })
  @IsString({ message: 'The customer address must be a string' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'The customer company must be a string' })
  company?: string;

  @IsOptional()
  @IsString({ message: 'The customer note must be a string' })
  note?: string;

  @IsOptional()
  @IsEnum(CustomerLevel, { message: 'The level is not valid' })
  level?: ICustomerLevel;
}

export class UpdateCustomerDto extends PartialType(CustomerDto) { }