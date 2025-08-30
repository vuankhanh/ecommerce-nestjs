import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Validate,
} from 'class-validator';
import { HasDefaultLangConstraint } from 'src/shared/custom-validator/multiple-lang.validator';
import { TLanguage } from 'src/shared/interface/lang.interface';
import { IProduct } from 'src/shared/interface/product.interface';

export class ProductDto implements IProduct {
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @Validate(HasDefaultLangConstraint)
  name: { [key in TLanguage]: string };

  @IsOptional()
  @IsMongoId({ message: 'Id danh mục sản phẩm phải là chuỗi ObjectId' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  productCategoryId?: string;

  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  @Validate(HasDefaultLangConstraint)
  description: { [key in TLanguage]: string };

  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  @Validate(HasDefaultLangConstraint)
  shortDescription: { [key in TLanguage]: string };

  @IsMongoId({ message: 'Id album phải là chuỗi ObjectId' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  albumId: string;

  @IsNotEmpty({ message: 'Giá không được để trống' })
  @IsNumber({}, { message: 'Giá phải là số' })
  price: number;

  @IsNotEmpty({ message: 'Còn hàng được để trống' })
  @IsBoolean({ message: 'Còn hàng phải là Boolean' })
  inStock: boolean;
}

export class UpdateProductDto extends PartialType(ProductDto) {}
