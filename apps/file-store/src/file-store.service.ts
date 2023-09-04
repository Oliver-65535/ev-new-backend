import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FileStoreService {
  constructor() {}

  async uploadedFile(file: Express.Multer.File): Promise<string> {
    return file.path;
  }

  async uploadMultipleFiles(files): Promise<string[]> {
    return files.path;
  }
}
