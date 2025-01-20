import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Post('set')
  async setKey(
    @Body('key') key: string,
    @Body('value') value: string,
    @Body('ttl') ttl?: number,
  ) {
    await this.redisService.set(key, value, ttl);
    return { message: `Key ${key} set successfully` };
  }

  @Get('get')
  async getKey(@Query('key') key: string) {
    const value = await this.redisService.get(key);
    return { key, value };
  }

  @Post('sorted-set')
  async addToSortedSet(
    @Body('key') key: string,
    @Body('score') score: number,
    @Body('member') member: string,
  ) {
    await this.redisService.addToSortedSet(key, score, member);
    return { message: `Member ${member} added to sorted set ${key}` };
  }

  @Get('sorted-set')
  async getSortedSetRange(
    @Query('key') key: string,
    @Query('start') start: number,
    @Query('end') end: number,
  ) {
    const members = await this.redisService.getSortedSetRange(key, start, end);
    return { key, members };
  }

  @Post('lock')
  async acquireLock(@Body('key') key: string, @Body('ttl') ttl: number) {
    const acquired = await this.redisService.acquireLock(key, ttl);
    return { key, acquired };
  }

  @Post('release-lock')
  async releaseLock(@Body('key') key: string) {
    await this.redisService.releaseLock(key);
    return { message: `Lock ${key} released successfully` };
  }
}
