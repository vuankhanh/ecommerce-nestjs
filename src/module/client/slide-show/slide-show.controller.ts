import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/core/interceptors/format_response.interceptor';
import { SlideShowService } from './slide-show.service';

@Controller('slide-show')
@UseInterceptors(FormatResponseInterceptor)
export class SlideShowController {
  constructor(private readonly slideShowService: SlideShowService) {}

  @Get()
  async getDetail() {
    return await this.slideShowService.getDetail();
  }
}
