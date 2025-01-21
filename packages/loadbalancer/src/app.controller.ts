import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { RedisService } from './redis/redis.service';

const SERVER_MATRIC_KEY = `server:system:metrics`;
@Controller('lb')
export class AppController {
  constructor(private readonly redisService: RedisService) {}

  @Get('/:type/:id')
  async findOptimalServer(
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    if (type !== 'space' && type !== 'note') {
      throw new HttpException(
        '타입이 note 혹은 space가 아닙니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const connectedServer = await this.redisService.findConnectedServer(id);
    if (!connectedServer) {
      const optimalServer =
        await this.redisService.getOptimalServer('SERVER_MATRIC_KEY');
      return { server: optimalServer, type: type, urlId: id };
    }

    return { server: connectedServer, type: type, urlId: id };
  }
}
