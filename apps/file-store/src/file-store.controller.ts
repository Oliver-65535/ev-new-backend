import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  Param,
} from '@nestjs/common';

import {
  FILE_INTERCEPTOR,
  FILE_MULTIPLE_INTERCEPTOR,
} from './file-store.interceptors';
import { FileStoreService } from './file-store.service';

@Controller('file-store')
export class FileStoreController {
  constructor(private readonly fileStoreService: FileStoreService) {}

  @Post('upload/:articleId')
  @UseInterceptors(FILE_INTERCEPTOR)
  async uploadedFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileStoreService.uploadMultipleFiles(file);
  }

  @Post('multiple-upload/:articleId')
  @UseInterceptors(FILE_MULTIPLE_INTERCEPTOR)
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileStoreService.uploadMultipleFiles(files);
  }

  @Get(':article/:filename')
  seeUploadedFile(
    @Param('filename') file: string,
    @Param('article') article: string,
    @Res() res,
  ) {
    return res.sendFile(file, { root: `./files/${article}` });
  }
}
