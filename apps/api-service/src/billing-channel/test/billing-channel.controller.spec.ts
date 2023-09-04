import { Test, TestingModule } from '@nestjs/testing';

import { BillingChannelController } from '../billing-channel.controller';

describe('BillingChannelController', () => {
  let controller: BillingChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingChannelController],
    }).compile();

    controller = module.get<BillingChannelController>(BillingChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
