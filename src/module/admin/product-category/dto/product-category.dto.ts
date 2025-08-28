import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, Validate } from "class-validator";
import { HasDefaultLangConstraint } from "src/shared/custom-validator/multiple-lang.validator";
import { TLanguage } from "src/shared/interface/lang.interface";
import { IProductCategory } from "src/shared/interface/product.interface";


export class ProductCategoryDto implements IProductCategory {
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @Validate(HasDefaultLangConstraint)
  name: { [key in TLanguage]: string };

  @IsOptional()
  @IsMongoId({ message: 'Id Product Category album phải là chuỗi ObjectId' })
  @Transform(({ value }) => value === '' ? undefined : value)
  albumId?: string; // ID của album chứa ảnh danh mục

  @IsOptional()
  @Validate(HasDefaultLangConstraint)
  description?: { [key in TLanguage]: string };

  @IsOptional()
  @IsMongoId({ message: 'Id Product Category parent phải là chuỗi ObjectId' })
  @Transform(({ value }) => value === '' ? undefined : value)
  parentId?: string; // ID của danh mục cha

  @IsNotEmpty({ message: 'isActive không được để trống' })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là true hoặc false' })
  isActive: boolean;
}

export class UpdateProductCategoryDto extends PartialType(ProductCategoryDto) { }