import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NoteController } from './note.controller';
import { NoteDocument, NoteSchema } from './note.schema';
import { NoteService } from './note.service';
import { SpaceModule } from 'src/space/space.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
    ]),
    SpaceModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
