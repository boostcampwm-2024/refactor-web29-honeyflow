import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client;

  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
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

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async addToSortedSet(
    key: string,
    score: number,
    member: string,
  ): Promise<void> {
    await this.client.zAdd(key, [{ score, value: member }]);
  }

  async getSortedSetRange(
    key: string,
    start: number,
    end: number,
  ): Promise<string[]> {
    return await this.client.zRange(key, start, end);
  }

  async acquireLock(lockKey: string, ttl: number) {
    const lockValue = `${Date.now()}`;
    const result = await this.client.set(lockKey, lockValue, {
      NX: true,
      PX: ttl,
    });
    return result === 'OK';
  }

  async releaseLock(lockKey: string) {
    await this.client.del(lockKey);
  }
}
