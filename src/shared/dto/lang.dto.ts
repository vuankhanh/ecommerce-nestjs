import { IsEnum, IsNotEmpty } from 'class-validator';
import { Language } from 'src/constant/lang.constant';
import { TLanguage } from '../interface/lang.interface';

const allowedLangs = Object.values(Language).join(', ');

export class LangDto {
  @IsNotEmpty()
  @IsEnum(Language, { message: `lang phải là ${allowedLangs}` })
  lang: TLanguage;
}
