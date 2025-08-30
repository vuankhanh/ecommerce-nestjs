import { PipeTransform, Injectable } from '@nestjs/common';
import { DiskStoragePipe } from 'src/shared/core/pipes/disk-storage.pipe';
import {
  ChangeUploadfileNamePipe,
  ChangeUploadfilesNamePipe,
} from 'src/shared/core/pipes/change-uploadfile-name.pipe';
import {
  FileProcessPipe,
  FilesProcessPipe,
} from 'src/shared/core/pipes/file_process.pipe';
import { IMedia } from '../../interface/media.interface';

@Injectable()
export class OptionalFilePipe implements PipeTransform {
  constructor(
    private readonly changeUploadfileNamePipe: ChangeUploadfileNamePipe,
    private readonly fileProcessPipe: FileProcessPipe,
    private readonly diskStoragePipe: DiskStoragePipe,
  ) {}

  async transform(value: any) {
    if (!value) {
      return value;
    }

    const changeUploadfileNameValue =
      this.changeUploadfileNamePipe.transform(value);
    const fileProcessVlue = await this.fileProcessPipe.transform(
      changeUploadfileNameValue,
    );
    const diskStorageVlue = this.diskStoragePipe.transform(fileProcessVlue);

    return diskStorageVlue;
  }
}

@Injectable()
export class OptionalFilesPipe implements PipeTransform {
  constructor(
    private readonly changeUploadfilesNamePipe: ChangeUploadfilesNamePipe,
    private readonly filesProcessPipe: FilesProcessPipe,
    private readonly diskStoragePipe: DiskStoragePipe,
  ) {}

  async transform(value: any) {
    if (!value) {
      return value;
    }

    const changeUploadfilesNameValue =
      this.changeUploadfilesNamePipe.transform(value);
    const filesProcessVlue = await this.filesProcessPipe.transform(
      changeUploadfilesNameValue,
    );
    const diskStorageVlue: Array<IMedia> = this.diskStoragePipe.transform(
      filesProcessVlue,
    ) as Array<IMedia>;

    return diskStorageVlue;
  }
}
