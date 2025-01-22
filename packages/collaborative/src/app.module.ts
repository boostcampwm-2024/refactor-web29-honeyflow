import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CollaborativeModule } from './collaborative/collaborative.module';
import { getMongooseConfig } from './common/config/mongo.config';
import { getTypeOrmConfig } from './common/config/typeorm.config';
import { YjsModule } from './yjs/yjs.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { ResourceMatricsModule } from './common/resource-matrics/resource-matrics.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getMongooseConfig,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    YjsModule,
    CollaborativeModule,
    RedisModule,
    ResourceMatricsModule,
  ],
  providers: [RedisService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit(): Promise<void> {
    this.logger.debug('Application initialized for debug');
    this.logger.log('Application initialized', {
      module: 'AppModule',
      environment: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
    });
  }
}
