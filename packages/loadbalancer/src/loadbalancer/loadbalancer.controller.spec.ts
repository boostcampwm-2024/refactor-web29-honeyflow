import { Test, TestingModule } from '@nestjs/testing';
import { LoadbalancerController } from './loadbalancer.controller';

describe('LoadbalancerController', () => {
  let controller: LoadbalancerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoadbalancerController],
    }).compile();

    controller = module.get<LoadbalancerController>(LoadbalancerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
