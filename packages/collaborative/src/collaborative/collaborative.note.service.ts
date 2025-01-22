import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ERROR_MESSAGES } from '../common/constants/error.message.constants';
import { NoteDocument } from './schema/note.schema';

@Injectable()
export class CollaborativeNoteService {
  private readonly logger = new Logger(CollaborativeNoteService.name);

  constructor(
    @InjectModel(NoteDocument.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  async findById(id: string) {
    this.logger.log(`ID가 ${id}인 노트를 검색 중입니다.`);

    const note = await this.noteModel.findOne({ id }).exec();

    this.logger.debug(`ID가 ${id}인 노트 검색 결과: ${!!note}`);

    return note;
  }

  async existsById(id: string) {
    this.logger.log(`ID가 ${id}인 노트의 존재 여부를 확인 중입니다.`);

    const note = await this.noteModel.findOne({ id }).exec();
    const exists = !!note;

    this.logger.debug(`ID가 ${id}인 노트 존재 여부: ${exists}`);

    return exists;
  }

  async updateContent(id: string, newContent: string) {
    this.logger.log(`ID가 ${id}인 노트의 내용을 업데이트 중입니다.`);

    const note = await this.findById(id);

    if (!note) {
      this.logger.error(`업데이트 실패: ID가 ${id}인 노트를 찾을 수 없습니다.`);
      throw new BadRequestException(ERROR_MESSAGES.NOTE.NOT_FOUND);
    }

    this.logger.debug(`이전 내용: ${note.content}`);
    note.content = newContent;

    try {
      const updatedNote = await note.save();

      this.logger.log(`ID가 ${id}인 노트 내용 업데이트 완료.`);
      this.logger.debug(`업데이트된 내용: ${updatedNote.content}`);

      return updatedNote;
    } catch (error) {
      this.logger.error(
        `ID가 ${id}인 노트의 내용 업데이트 중 오류 발생.`,
        error.stack,
      );
      throw new BadRequestException(ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }

  async updateByNote(id: string, note: string) {
    try {
      this.logger.log('노트 내용 업데이트 시작', {
        method: 'updateByNote',
        noteId: id,
        length: note.length,
      });

      const updatedNote = await this.updateContent(id, note);

      this.logger.log('노트 내용 업데이트 완료', {
        method: 'updateByNote',
        noteId: id,
      });

      return updatedNote;
    } catch (error) {
      this.logger.error('노트 내용 업데이트 실패', {
        method: 'updateByNote',
        noteId: id,
        error: error.message,
        stack: error.stack,
      });
      throw new BadRequestException(ERROR_MESSAGES.NOTE.UPDATE_FAILED);
    }
  }

  async findByNote(id: string) {
    try {
      this.logger.log('노트 조회 시작', {
        method: 'findByNote',
        noteId: id,
      });

      const note = await this.findById(id);

      this.logger.log('노트 조회 완료', {
        method: 'findByNote',
        noteId: id,
        found: !!note,
      });

      return note;
    } catch (error) {
      this.logger.error('노트 조회 실패', {
        method: 'findByNote',
        noteId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
