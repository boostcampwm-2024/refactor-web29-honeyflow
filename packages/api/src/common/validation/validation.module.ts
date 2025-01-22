import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteDocument, NoteSchema } from 'src/note/note.schema';
import { SpaceDocument, SpaceSchema } from 'src/space/space.schema';
import { ValidationService } from './validation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
  ],
  providers: [ValidationService],
  exports: [ValidationService],
})
export class ValidationModule {}
