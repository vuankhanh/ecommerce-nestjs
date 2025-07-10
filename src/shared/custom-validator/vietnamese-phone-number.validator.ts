import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsVietnamesePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVietnamesePhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // Loại bỏ khoảng trắng và dấu gạch ngang
          const cleanPhone = value.replace(/[\s\-]/g, '');
          
          // Các regex pattern cho số điện thoại VN
          const patterns = [
            // Số bắt đầu bằng 0 (10 số)
            /^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
            // Số bắt đầu bằng +84 (12 ký tự)
            /^\+84(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
            // Số bắt đầu bằng 84 (11 số)
            /^84(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/
          ];
          
          return patterns.some(pattern => pattern.test(cleanPhone));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} phải là số điện thoại Việt Nam hợp lệ. Định dạng: 0XXXXXXXXX, +84XXXXXXXXX hoặc 84XXXXXXXXX`;
        }
      }
    });
  };
}