import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomBadRequestException } from '../exception/custom-exception';

@Injectable()
export class FileProccedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.file) {
      throw new CustomBadRequestException('Không có files được gửi lên');
    }

    this.validateFileInfoField(request.body, request.file);
    return next.handle();
  }

  private validateFileInfoField(body: any, file: Express.Multer.File) {

    if (!body || typeof body !== 'object') {
      throw new CustomBadRequestException('Invalid body format');
    }

    if (!body.file_0) throw new CustomBadRequestException('Không có trường thông tin file_0');
    console.log(body.file_0);

    let result: any;
    try {
      result = JSON.parse(body.file_0);

      // Check if result is still a string (double-encoded JSON)
      if (typeof result === 'string') {
        result = JSON.parse(result);
      }
    } catch (error) {
      throw new CustomBadRequestException(`Trường thông tin file_0 không phải là JSON hợp lệ`);
    }

    if (result.fileName != file.originalname) throw new CustomBadRequestException(`Tên file trong trường thông tin file_0 không khớp với tên file đã tải lên`);

    body.file_0 = result;
  }
}