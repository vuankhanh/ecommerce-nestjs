import { Injectable, PipeTransform } from '@nestjs/common';
import { CustomBadRequestException } from '../exception/custom-exception';

@Injectable()
export class StringPipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}

@Injectable()
export class PhoneNumberInputPipe implements PipeTransform {
  transform(value: string) {
    const specialCharRegex = /^[^a-zA-Z0-9]/;
    if (specialCharRegex.test(value)) {
      throw new CustomBadRequestException(
        'Số điện thoại không được bắt đầu bằng ký tự đặc biệt',
      );
    }

    return value;
  }
}
