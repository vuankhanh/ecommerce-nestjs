import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'src/constant/order.constant';

export class FilterDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Từ khóa tìm kiếm phải là ngày tháng' })
  fromDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Từ khóa tìm kiếm phải là ngày tháng' })
  toDate?: Date;

  @IsOptional()
  @IsArray({ message: 'Trạng thái phải là một mảng' })
  @IsString({ each: true, message: 'Mỗi trạng thái phải là chuỗi' })
  statuses?: `${OrderStatus}`;
}
