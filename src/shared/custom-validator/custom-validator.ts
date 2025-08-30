import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [validateFn] = args.constraints;
    return validateFn(value);
  }

  defaultMessage() {
    return 'Validation failed!';
  }
}

export function IsValid(
  validateFn: (value: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validateFn],
      validator: IsValidConstraint,
    });
  };
}

@ValidatorConstraint({ async: false })
export class IsEnumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [validValues] = args.constraints;
    return validValues.includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const [validValues] = args.constraints;
    return `Value must be one of the following: ${validValues.join(', ')}`;
  }
}

export function IsEnum(
  validValues: any[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validValues],
      validator: IsEnumConstraint,
    });
  };
}
