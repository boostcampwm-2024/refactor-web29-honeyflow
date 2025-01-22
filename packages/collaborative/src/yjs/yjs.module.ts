import { Module } from '@nestjs/common';

import { CollaborativeModule } from '../collaborative/collaborative.module';
import { YjsGateway } from './yjs.gateway';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [CollaborativeModule, RedisModule],
  providers: [YjsGateway],
})
export class YjsModule {}
