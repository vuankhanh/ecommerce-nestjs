import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AlbumService } from '../album.service';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { CustomBadRequestException, CustomInternalServerErrorException } from 'src/shared/core/exception/custom-exception';
@Injectable()
export class ValidateModifyAlbumGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly albumService: AlbumService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const query = request.query;
    const id = query.id;
    if(!id) {
      return false;
    }

    const filterQuery = { _id: ObjectId.createFromHexString(id) };
    const album = await this.albumService.getDetail(filterQuery);
    
    if (!album) {
      throw new CustomBadRequestException('Không tìm thấy Album này');
    };

    if(!album.relativePath) {
      throw new CustomInternalServerErrorException('Album relative path not found');
    }

    const uploadsFolder = this.configService.get('folder.uploads');
    request['customParams'] = {};
    
    request.customParams.uploadsFolder = uploadsFolder;
    request.customParams.relativePath = 'product';
    
    return true;
  }
}