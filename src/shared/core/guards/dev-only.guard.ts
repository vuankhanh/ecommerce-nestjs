import { CanActivate, Injectable } from '@nestjs/common';
import { CustomForbiddenException } from '../exception/custom-exception';

@Injectable()
export class DevOnlyGuard implements CanActivate {
  canActivate(): boolean {
    if (process.env.NODE_ENV === 'pro') {
      throw new CustomForbiddenException('Chỉ được phép ở chế độ development');
    }
    return true;
  }
}
