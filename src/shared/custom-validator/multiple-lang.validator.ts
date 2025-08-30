import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'HasDefaultLang', async: false })
export class HasDefaultLangConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return value && typeof value.vi === 'string' && value.vi.trim().length > 0;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} phải có trường vi (ngôn ngữ mặc định) và không được để trống`;
  }
}
