import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client;

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

  async get(key: string) {
    return await this.client.get(key);
  }

  async findConnectedServer(id: string) {
    const key = `ws:connection:${id}`;
    const result = await this.client.get(key);
    if (!result) return null;
    const parsedResult = JSON.parse(result);

    return parsedResult.serverId || null;
  }

  async getOptimalServer(key: string) {
    try {
      const optimalServer = await this.client.zRange(key, 0, 0, {
        WITHSCORES: true,
      });
      if (optimalServer.length === 0) {
        return null;
      }
      return optimalServer[0];
    } catch (err) {
      throw err;
    }
  }
}
