import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
} from '@nestjs/common';
import { RedisService } from './redis/redis.service';

const SERVER_MATRIC_KEY = `server:system:metrics`;
@Controller('lb')
export class AppController {
  constructor(private readonly redisService: RedisService) {}

  private readonly logger = new Logger(AppController.name);

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

    this.logger.debug(`Load Balancer 시작 type:{type} id:{id}`);
    const connectedServer = await this.redisService.findConnectedServer(id);
    this.logger.debug(
      `Load Balancer 연결된 서버가 존재하는지 여부 확인 connectedServer:${connectedServer}`,
    );
    if (!connectedServer) {
      const optimalServer =
        await this.redisService.getOptimalServer(SERVER_MATRIC_KEY);
      this.logger.debug(
        `Load Balancer 연결된 서버가 없는 경우 최적의 서버 탐색 여부 확인 optimalServer:${optimalServer}`,
      );
      return { server: optimalServer, type: type, urlId: id };
    }

    return { server: connectedServer, type: type, urlId: id };
  }
}
