import { Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from 'src/constant/user.constant';
import { Roles } from 'src/shared/core/decorator/roles.decorator';
import { LocalAuthGuard } from 'src/shared/core/guards/auth.guard';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { AccountService } from 'src/shared/service/account.service';

@Controller()
@Roles(UserRole.CLIENT)
@UseGuards(LocalAuthGuard)
@UseInterceptors(FormatResponseInterceptor)
export class InfoController {
  constructor(
    private readonly accountService: AccountService
  ) {}

  @Get()
  get(
    @Req() req: Request
  ) {
    const payload = req['payload'];
    console.log('Payload:', payload);
    const { email } = payload;
    if (!email) {
      throw new Error('Email not found in payload');
    }

    return this.accountService.findOne({email})
    // Logic to get personal information of the user
  }
}
