import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';
import { CustomBadRequestException } from 'src/shared/core/exception/custom-exception';
import { DevOnlyGuard } from 'src/shared/core/guards/dev-only.guard';

@Controller('mail')
@UseGuards(DevOnlyGuard)
export class MailController {
  constructor(private readonly mailSenderService: MailSenderService) {}

  @Post('test')
  async sendTestMail(@Body('toEmail') toEmail: string) {
    if (!toEmail) throw new CustomBadRequestException('Thiếu email người nhận');
    await this.mailSenderService.sendTestEmail(toEmail);
    return { message: 'Test mail endpoint' };
  }
}
