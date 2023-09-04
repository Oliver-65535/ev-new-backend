import { Module } from '@nestjs/common';
import { OpenPGPCoreService } from './utils/openpgp-core.service';
import { OpenPGPService } from './openpgp.service';
import { VaultModule } from 'libs/vault/src/vault.module';

@Module({
  imports: [VaultModule],
  providers: [OpenPGPService, OpenPGPCoreService],
  exports: [OpenPGPService],
})
export class OpenPGPModule {}
