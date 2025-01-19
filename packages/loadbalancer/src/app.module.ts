import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { LoadbalancerController } from './loadbalancer/loadbalancer.controller';

@Module({
  imports: [RedisModule],
  controllers: [AppController, LoadbalancerController],
  providers: [AppService, RedisService],
})
export class AppModule {}
