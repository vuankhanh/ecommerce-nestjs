import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { AddressDto } from "src/shared/dto/address.dto";
import { CoordinatesDto } from "src/shared/dto/coordinates.dto";
import { ISupplierLocation } from "src/shared/interface/supplier_location.interface";
import { SupplierDebtDto } from "./supplier_debt.dto";

export class SupplierLocationDto implements ISupplierLocation {
  @IsNotEmpty({ message: 'The supplier name is required' })
  @IsString({ message: 'The supplier name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'The address is required' })
  @ValidateNested() // Validate các thuộc tính bên trong address
  @Type(() => AddressDto) // Chỉ định class để validate
  address: AddressDto;

  @IsNotEmpty({ message: 'The telephone is required' })
  @IsString({ message: 'The telephone must be a string' })
  telephone: string;

  @IsOptional()
  @ValidateNested() // Validate các thuộc tính bên trong debt
  @Type(()=> SupplierDebtDto)
  debt?: SupplierDebtDto; // Optional field for supplier debt

  @IsOptional()
  @IsEmail({}, { message: 'The email is not valid' }) 
  email?: string;

  @IsOptional()
  @ValidateNested() // Validate các thuộc tính bên trong address
  @Type(() => CoordinatesDto) // Chỉ định class để validate
  position?: CoordinatesDto;
}

export class UpdateSupplierLocationDto extends PartialType(SupplierLocationDto) { }