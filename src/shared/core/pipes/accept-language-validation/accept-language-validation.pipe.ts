import { Injectable, PipeTransform } from '@nestjs/common';
import { CustomBadRequestException } from '../../exception/custom-exception';
import { Language } from 'src/constant/lang.constant';

@Injectable()
export class AcceptLanguageValidationPipe implements PipeTransform {
  transform(value: Language) {
    const allowedLangs = Object.values(Language);
    if (!allowedLangs.includes(value)) {
      throw new CustomBadRequestException(`accept-language phải là một trong: ${allowedLangs.join(', ')}`);
    }
    return value;
  }
}
