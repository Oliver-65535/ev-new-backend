import { AppKey } from '@app/configuration/interfaces';
import { SetMetadata } from '@nestjs/common';

export const Bootstrappable = (appKey: AppKey) => SetMetadata('appKey', appKey);
