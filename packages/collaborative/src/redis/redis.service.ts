import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';
import { Cron } from '@nestjs/schedule';
import { ResourceMetricsService } from 'src/common/resource-matrics/resource-matrics.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client;

  constructor(
    private readonly resourceMetricsService: ResourceMetricsService,
  ) {}

  async onModuleInit() {
    this.client = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    this.client.on('error', (err) => console.error('Redis Error:', err));
    await this.client.connect();
    console.log('Redis connected successfully');
  }

  async onModuleDestroy() {
    await this.client.disconnect();
    console.log('Redis connection closed');
  }

  async updateRedisConnection(urlId: string, action: 'add' | 'remove') {
    const serverId = process.env.SERVER_ID;
    const key = `ws:connection:${urlId}`;
    const existingData = await this.client.get(key);

    let connectionData = existingData
      ? JSON.parse(existingData)
      : { serverId, connectionCount: 0 };

    if (action === 'add') {
      connectionData.connectionCount += 1;
    } else {
      this.client.del(key);
      return;
    }

    await this.client.set(key, JSON.stringify(connectionData));
  }

  @Cron('*/10 * * * * *')
  async cronSystemMetrics() {
    const serverId = process.env.SERVER_ID;
    const key = `server:system:metrics`;

    try {
      const { cpuUsage } = await this.resourceMetricsService.getSystemMetrics();
      await this.client.zAdd(key, {
        score: cpuUsage,
        value: serverId,
      });
    } catch (err) {}
  }
}
