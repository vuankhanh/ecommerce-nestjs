import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IProduct } from "src/shared/interface/product.interface";

export class ProductDto implements IProduct {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi' })
  name: string;

  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description: string;

  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  @IsString({ message: 'Mô tả ngắn phải là chuỗi' })
  shortDescription: string;

  @IsMongoId({ message: 'Id album phải là chuỗi ObjectId' })
  albumId: string;

  @IsNotEmpty({ message: 'Giá không được để trống' })
  @IsNumber({}, { message: 'Giá phải là số' })
  price: number;

  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  @IsString({ message: 'Danh mục phải là chuỗi' })
  category: string;

  @IsNotEmpty({ message: 'Còn hàng được để trống' })
  @IsBoolean({ message: 'Còn hàng phải là số' })
  stock: number;
}

export class UpdateProductDto extends PartialType(ProductDto) { }