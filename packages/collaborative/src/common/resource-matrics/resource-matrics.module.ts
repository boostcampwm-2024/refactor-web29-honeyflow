import { Module } from '@nestjs/common';
import { ResourceMetricsService } from './resource-matrics.service';

@Module({
  providers: [ResourceMetricsService],
  exports: [ResourceMetricsService],
})
export class ResourceMatricsModule {}
