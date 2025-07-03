import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IProduct } from "src/shared/interface/product.interface";

export class ProductDto implements IProduct {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi' })
  name: string;

  @IsOptional()
  @IsMongoId({ message: 'Id danh mục sản phẩm phải là chuỗi ObjectId' })
  @Transform(({ value }) => value === '' ? undefined : value)
  productCategoryId?: string;

  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description: string;

  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  @IsString({ message: 'Mô tả ngắn phải là chuỗi' })
  shortDescription: string;

  @IsMongoId({ message: 'Id album phải là chuỗi ObjectId' })
  @Transform(({ value }) => value === '' ? undefined : value)
  albumId: string;

  @IsNotEmpty({ message: 'Giá không được để trống' })
  @IsNumber({}, { message: 'Giá phải là số' })
  price: number;

  @IsNotEmpty({ message: 'Còn hàng được để trống' })
  @IsBoolean({ message: 'Còn hàng phải là Boolean' })
  inStock: boolean;
}

export class UpdateProductDto extends PartialType(ProductDto) { }