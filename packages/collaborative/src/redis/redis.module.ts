import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ResourceMatricsModule } from 'src/common/resource-matrics/resource-matrics.module';

@Module({
  imports: [ResourceMatricsModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
