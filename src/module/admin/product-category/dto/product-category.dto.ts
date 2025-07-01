import { PartialType } from "@nestjs/mapped-types";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IProductCategory } from "src/shared/interface/product.interface";


export class ProductCategoryDto implements IProductCategory {
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Mô tả Product Category không được để trống' })
  description?: string;

  @IsOptional()
  @IsMongoId({ message: 'Id Product Category parent phải là chuỗi ObjectId' })
  parentId?: string; // ID của danh mục cha
}

export class UpdateProductCategoryDto extends PartialType(ProductCategoryDto) { }