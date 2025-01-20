import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Node, SpaceData } from 'shared/types';
import { v4 as uuid } from 'uuid';

import { SpaceDocument } from './space.schema';
import { SpaceValidation } from './space.validation.service';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';

@Injectable()
export class SpaceService {
  private readonly logger = new Logger(SpaceService.name);

  constructor(
    private readonly spaceValidation: SpaceValidation,
    @InjectModel(SpaceDocument.name)
    private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  async findById(id: string) {
    this.logger.log(`ID가 ${id}인 스페이스를 조회합니다.`);
    const result = await this.spaceModel.findOne({ id }).exec();
    return result;
  }

  async updateById(id: string, data: Partial<SpaceDocument>) {
    this.logger.log(`ID가 ${id}인 스페이스를 업데이트합니다.`);

    if (!id || !data) {
      throw new Error('유효하지 않은 매개변수입니다.');
    }
    const space = await this.findById(id);

    if (!space) {
      this.logger.error(
        `업데이트 실패: ID가 ${id}인 스페이스를 찾을 수 없습니다.`,
      );
      throw new BadRequestException(ERROR_MESSAGES.NOTE.NOT_FOUND);
    }

    const updatedSpace = await this.spaceModel
      .findOneAndUpdate({ id }, { $set: data }, { new: true })
      .exec();

    if (!updatedSpace) {
      throw new Error(`ID가 ${id}인 스페이스를 찾을 수 없습니다.`);
    }

    return updatedSpace;
  }

  async existsById(id: string) {
    this.logger.log(`ID가 ${id}인 스페이스의 존재 여부를 확인합니다.`);

    const space = await this.spaceModel.findOne({ id }).exec();
    return !!space;
  }
}
