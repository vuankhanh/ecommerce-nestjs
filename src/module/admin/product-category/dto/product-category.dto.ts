import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IProductCategory } from "src/shared/interface/product.interface";


export class ProductCategoryDto implements IProductCategory {
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Mô tả Product Category không được để trống' })
  description?: string;

  @IsMongoId({ message: 'Id Product Category parent phải là chuỗi ObjectId' })
  parentId?: string; // ID của danh mục cha

  @IsOptional()
  @IsString({ message: 'Tiêu đề SEO phải là chuỗi' })
  metaTitle?: string;       // SEO

  @IsOptional()
  @IsString({ message: 'Mô tả SEO phải là chuỗi' })
  metaDescription?: string; // SEO

  @IsOptional()
  @IsString({ each: true, message: 'Từ khóa SEO phải là chuỗi' })
  metaKeywords?: string[];  // SEO
}