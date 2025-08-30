import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { AccountService } from 'src/shared/service/account.service';

@Injectable()
export class AccountIdGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request.payload;

    if (!payload || !payload.email) {
      throw new CustomBadRequestException(
        'Payload không hợp lệ hoặc không chứa email',
      );
    }

    const { email } = payload;
    const accountId: string =
      await this.accountService.getIdAccountByEmail(email);
    request['customParams'] = {};
    request.customParams.accountId = accountId;
    return true;
  }
}
