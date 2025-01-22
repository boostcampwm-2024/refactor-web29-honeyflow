import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SpaceController } from './space.controller';
import { SpaceDocument, SpaceSchema } from './space.schema';
import { SpaceService } from './space.service';
import { NoteModule } from 'src/note/note.module';
import { ValidationModule } from 'src/common/validation/validation.module';

@Module({
  imports: [
    NoteModule,
    ValidationModule,
    MongooseModule.forFeature([
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
