import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { IProduct } from "src/shared/interface/product.interface";

export class ProductDto implements IProduct {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi' })
  name: string;

  @IsNotEmpty({ message: 'Giá không được để trống' })
  @IsNumber({}, { message: 'Giá phải là số' })
  price: number;

  @IsNotEmpty({ message: 'Còn hàng được để trống' })
  @IsBoolean({ message: 'Còn hàng phải là boolean' })
  availability: boolean;

  @IsNotEmpty({ message: 'Đơn vị không được để trống' })
  @IsString({ message: 'Đơn vị phải là chuỗi' })
  unit: string;

  @IsMongoId({ message: 'Id album phải là chuỗi ObjectId' })
  albumId: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Hướng dẫn sử dụng phải là chuỗi' })
  usageInstructions: string;

  @IsOptional()
  @IsString({ message: 'Thương hiệu phải là chuỗi' })
  brand?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Điểm đánh giá trung bình phải là số' })
  rating?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Số lượt đánh giá phải là số' })
  reviews?: number;
}

export class UpdateProductDto extends PartialType(ProductDto) { }