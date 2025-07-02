import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IProductCategory } from "src/shared/interface/product.interface";


export class ProductCategoryDto implements IProductCategory {
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  name: string;

  @IsOptional()
  @IsMongoId({ message: 'Id Product Category album phải là chuỗi ObjectId' })
  @Transform(({ value }) => value === '' ? undefined : value)
  albumId?: string; // ID của album chứa ảnh danh mục

  @IsOptional()
  @IsString({ message: 'Mô tả Product Category không được để trống' })
  description?: string;

  @IsOptional()
  @IsMongoId({ message: 'Id Product Category parent phải là chuỗi ObjectId' })
  @Transform(({ value }) => value === '' ? undefined : value)
  parentId?: string; // ID của danh mục cha

  @IsNotEmpty({ message: 'isActive không được để trống' })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là true hoặc false' })
  isActive: boolean;
}

export class UpdateProductCategoryDto extends PartialType(ProductCategoryDto) { }