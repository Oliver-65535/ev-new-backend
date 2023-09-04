import { GpgService } from './gpg.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [GpgService],
  exports: [GpgService],
})
export class GpgModule {}
