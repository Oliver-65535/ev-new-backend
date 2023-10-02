import { Test, TestingModule } from '@nestjs/testing';
import { InfluxDbService } from './influx-db.service';

describe('InfluxDbService', () => {
  let service: InfluxDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfluxDbService],
    }).compile();

    service = module.get<InfluxDbService>(InfluxDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
