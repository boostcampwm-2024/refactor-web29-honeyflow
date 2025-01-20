import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getMongooseConfig } from './common/config/mongo.config';
import { getTypeOrmConfig } from './common/config/typeorm.config';
import { NoteModule } from './note/note.module';
import { SpaceModule } from './space/space.module';
import { TestModule } from './test/test.module';
import { ValidationService } from './common/validation/validation.service';
import { ValidationModule } from './common/validation/validation.module';

@Module({
  imports: [
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
    ValidationModule,
    NoteModule,
    SpaceModule,
    TestModule,
  ],
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
