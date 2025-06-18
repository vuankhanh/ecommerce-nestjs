import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
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

  @IsOptional()
  @IsString({ message: 'Từ khóa hoặc nhãn phải là chuỗi' })
  tags?: string[];

  @IsOptional()
  @IsString({ message: 'Tiêu đề SEO phải là chuỗi' }) 
  metaTitle?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả SEO phải là chuỗi' })
  metaDescription?: string;

  @IsOptional()
  @IsString({ each: true, message: 'Từ khóa SEO phải là chuỗi' })
  metaKeywords?: string[];
}

export class UpdateProductDto extends PartialType(ProductDto) { }