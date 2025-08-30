import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomBadRequestException } from '../exception/custom-exception';

@Injectable()
export class FilesProccedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.files || request.files.length === 0) {
      throw new CustomBadRequestException('Không có files được gửi lên');
    }
    this.validateFileInfoFields(request.body, request.files);
    return next.handle();
  }

  private validateFileInfoFields(body: any, files: Express.Multer.File[]) {
    if (!body || typeof body !== 'object') {
      throw new CustomBadRequestException('Invalid body format');
    }

    const countKeys = Object.keys(body).length;
    if (countKeys != files.length) {
      throw new CustomBadRequestException(
        'Số lượng file không khớp với số lượng trường thông tin',
      );
    }

    const formatKey = Object.keys(body).some((key) => {
      return !/^file_\d+$/.test(key);
    });

    if (formatKey) {
      throw new CustomBadRequestException(
        'Tên trường thông tin không đúng định dạng',
      );
    }

    Object.keys(body).forEach((key, index) => {
      //Key có dạng file_1, file_2, ...
      // Làm sao để lấy ra số trong key để so sánh với index
      const fileIndex = parseInt(key.split('_')[1]);
      if (fileIndex !== index) {
        throw new CustomBadRequestException(
          `Trường thông tin ${key} không khớp với file thứ ${index + 1}`,
        );
      }
    });

    const entries = Object.entries(body);
    for (let index = 0; index < entries.length; index++) {
      const [key, value] = entries[index];
      let result: any;
      try {
        result = JSON.parse(value as string);

        // Check if result is still a string (double-encoded JSON)
        if (typeof result === 'string') {
          result = JSON.parse(result);
        }
      } catch {
        throw new CustomBadRequestException(
          `Trường thông tin ${key} không phải là JSON hợp lệ`,
        );
      }

      if (result.fileName != files[index].originalname)
        throw new CustomBadRequestException(
          `Tên file trong trường thông tin ${key} không khớp với tên file đã tải lên`,
        );
      body[key] = result;
    }
  }
}
