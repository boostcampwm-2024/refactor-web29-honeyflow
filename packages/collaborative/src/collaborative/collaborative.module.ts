import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CollaborativeSpaceService } from './collaborative.space.service';
import { CollaborativeNoteService } from './collaborative.note.service';
import { NoteDocument, NoteSchema } from './schema/note.schema';
import { SpaceDocument, SpaceSchema } from './schema/space.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
  ],
  providers: [CollaborativeSpaceService,CollaborativeNoteService],
  exports: [CollaborativeSpaceService, CollaborativeNoteService]
})
export class CollaborativeModule {}
