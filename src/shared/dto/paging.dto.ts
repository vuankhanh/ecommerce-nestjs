import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PagingDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(0)
  page: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Size must be a number' })
  @Min(1)
  size: number;
}
