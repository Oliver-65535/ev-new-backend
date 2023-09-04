import { Test, TestingModule } from '@nestjs/testing';
import { BillingChannelService } from './billing-channel.service';

describe('BillingChannelService', () => {
  let service: BillingChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingChannelService],
    }).compile();

    service = module.get<BillingChannelService>(BillingChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
