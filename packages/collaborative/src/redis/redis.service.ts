import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';
import { Cron } from '@nestjs/schedule';
import { ResourceMetricsService } from 'src/common/resource-matrics/resource-matrics.service';
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client;

  constructor(
    private readonly resourceMatricsService: ResourceMetricsService,
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
    const serverId = process.env.SERVER_ID || 'default-server';
    const key = `ws:connection:${urlId}`;
    const existingData = await this.client.get(key);

    let connectionData = existingData
      ? JSON.parse(existingData)
      : { serverId, connectionCount: 0 };

    if (action === 'add') {
      connectionData.connectionCount += 1;
    } else {
      connectionData.connectionCount = Math.max(
        connectionData.connectionCount - 1,
        0,
      );
    }

    await this.client.set(key, JSON.stringify(connectionData));
  }

  @Cron('*/10 * * * * *')
  async cronCPUUsage() {
    const serverId = process.env.SERVER_ID || 'default-server';
    const key = `server:cpu:${serverId}`;
    const cpuUsage = this.resourceMatricsService.getCpuUsage();
    try {
      this.client.set(key, JSON.stringify({ serverId, cpuUsage }));
    } catch (err) {}
  }
}
