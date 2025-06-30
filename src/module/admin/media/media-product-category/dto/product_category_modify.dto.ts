import { Transform, Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class ProductCategoryModifyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'IsMain must be a number' })
  isMain: number;
}

export class ProductCategoryModifyRemoveFilesDto {
  @IsArray({ message: 'filesWillRemove must be an array' })
  @IsMongoId({ each: true, message: 'filesWillRemove must be an array of string or ObjectId' })
  @Type(() => String)
  filesWillRemove: Array<mongoose.Types.ObjectId>;
}

export class ProductCategoryModifyItemIndexChangeDto {
  @IsArray({ message: 'newItemIndexChange must be an array' })
  @IsMongoId({ each: true, message: 'newItemIndexChange must be an array of string or ObjectId' })
  @Type(() => String)
  newItemIndexChange: Array<string | mongoose.Types.ObjectId>;
}