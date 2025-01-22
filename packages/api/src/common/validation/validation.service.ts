import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpaceDocument } from 'src/space/space.schema';
import { MAX_SPACES } from '../constants/space.constants';
import { ERROR_MESSAGES } from '../constants/error.message.constants';
import { NoteDocument } from 'src/note/note.schema';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);
  constructor(
    @InjectModel(NoteDocument.name)
    private readonly noteModel: Model<SpaceDocument>,
    @InjectModel(SpaceDocument.name)
    private readonly spaceModel: Model<SpaceDocument>,
  ) {}
  async validateNoteExsts(urlPath: string) {
    const note = await this.noteModel.findOne({ urlPath });

    if (!note) {
      throw new Error(ERROR_MESSAGES.SPACE.NOT_FOUND);
    }

    return note;
  }
  async validateSpaceLimit(userId: string) {
    const spaceCount = await this.spaceModel.countDocuments({ userId });

    if (spaceCount >= MAX_SPACES) {
      throw new Error(ERROR_MESSAGES.SPACE.LIMIT_EXCEEDED);
    }
  }

  async validateParentNodeExists(parentContextNodeId: string | null) {
    if (parentContextNodeId) {
      const space = await this.spaceModel.findOne({
        id: parentContextNodeId,
      });

      if (!space) {
        throw new Error(ERROR_MESSAGES.SPACE.PARENT_NOT_FOUND);
      }
    }
  }

  async validateSpaceExists(id: string) {
    const space = await this.spaceModel.findOne({ id });

    this.logger.debug(`validation result : ${space}`);

    if (!space) {
      throw new Error(ERROR_MESSAGES.SPACE.NOT_FOUND);
    }

    return space;
  }
}
