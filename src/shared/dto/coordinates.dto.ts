import {
  IsNotEmpty,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { ICoordinates } from '../interface/coordinates.interface';

export class CoordinatesDto implements ICoordinates {
  @IsNotEmpty({ message: 'The latitude is required' })
  @IsStringOrNumber({ message: 'The latitude must be a string or a number' })
  lat: string | number;

  @IsNotEmpty({ message: 'The longitude is required' })
  @IsStringOrNumber({ message: 'The longitude must be a string or a number' })
  lng: string | number;
}

export function IsStringOrNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || typeof value === 'number';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string or a number`;
        },
      },
    });
  };
}
