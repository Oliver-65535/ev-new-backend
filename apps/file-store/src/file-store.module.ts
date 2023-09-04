import { Module } from '@nestjs/common';
import { FileStoreController } from './file-store.controller';
import { MulterModule } from '@nestjs/platform-express';
import { Bootstrappable } from '@app/bootstrap';
import { FileStoreService } from './file-store.service';


@Bootstrappable('fileStore')
@Module({
  imports: [MulterModule.register({
    dest: './files',
  })],
  controllers: [FileStoreController],
  providers: [FileStoreService]
})
export class FileStoreModule {}
