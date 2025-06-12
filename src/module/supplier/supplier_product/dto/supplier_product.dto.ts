import { Types } from "mongoose";
import { ISupplierProduct } from "../../shared/interface/product.interface";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { SupplierProductUnit } from "src/constant/product.constant";
import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";

export class SupplierProductDto implements ISupplierProduct {
  @IsString({ message: 'The supplier product name must be a string' })
  @IsNotEmpty({ message: 'The supplier product name is required' })
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? parseFloat(value) : value))
  @IsNumber({}, { message: 'The supplier product price must be a number' })
  @IsNotEmpty({ message: 'The supplier product price is required' })
  price: number;

  @IsString({ message: 'The supplier product unit must be a string' })
  @IsNotEmpty({ message: 'The supplier product unit is required' })
  @IsEnum(SupplierProductUnit, { message: 'The supplier product unit is invalid' })
  unit: `${SupplierProductUnit}`;

  @IsOptional()
  @IsString({ message: 'The supplier product description must be a string' })
  description?: string;

  @IsMongoId({ message: 'The supplier ID must be a valid ObjectId' })
  @IsNotEmpty({ message: 'The supplier ID is required' })
  supplierLocationId: string;
}

export class UpdateSupplierProductDto extends PartialType(SupplierProductDto) { }