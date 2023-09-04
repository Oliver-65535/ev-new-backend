import { Test, TestingModule } from '@nestjs/testing';
import { BillingChannelResolver } from './billing-channel.resolver';

describe('BillingChannelResolver', () => {
  let resolver: BillingChannelResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingChannelResolver],
    }).compile();

    resolver = module.get<BillingChannelResolver>(BillingChannelResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
