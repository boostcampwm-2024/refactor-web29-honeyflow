import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SpaceDocument, SpaceSchema } from './space.schema';
import { SpaceService } from './space.service';
import { SpaceValidation } from './space.validation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
  ],
  providers: [SpaceService, SpaceValidation],
  exports: [SpaceService],
})
export class SpaceModule {}
