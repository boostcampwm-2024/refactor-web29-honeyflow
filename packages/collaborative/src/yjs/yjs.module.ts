import { Module } from '@nestjs/common';

import { CollaborativeModule } from '../collaborative/collaborative.module';
import { NoteModule } from '../note/note.module';
import { SpaceModule } from '../space/space.module';
import { YjsGateway } from './yjs.gateway';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [SpaceModule, NoteModule, CollaborativeModule, RedisModule],
  providers: [YjsGateway],
})
export class YjsModule {}
