import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SpaceDocument } from './schema/space.schema';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';

@Injectable()
export class CollaborativeSpaceService {
  private readonly logger = new Logger(CollaborativeSpaceService.name);

  constructor(
    @InjectModel(SpaceDocument.name)
    private readonly spaceModel: Model<SpaceDocument>,
  ) {}

  async updateBySpace(id: string, space: string) {
    try {
      this.logger.log('스페이스 정보 업데이트 시작', {
        method: 'updateBySpace',
        spaceId: id,
        length: space.length,
      });

      let spaceJsonData;
      try {
        spaceJsonData = JSON.parse(space);
      } catch (error) {
        throw new Error(`유효하지 않은 스페이스 JSON 데이터: ${error.message}`);
      }

      const updateDto = {
        edges: JSON.stringify(spaceJsonData.edges),
        nodes: JSON.stringify(spaceJsonData.nodes),
      };

      const updatedSpace = await this.spaceModel
        .findOneAndUpdate({ id }, { $set: updateDto }, { new: true })
        .exec();

      if (!updatedSpace) {
        throw new Error(`ID가 ${id}인 스페이스를 찾을 수 없습니다.`);
      }

      this.logger.log('스페이스 정보 업데이트 완료', {
        method: 'updateBySpace',
        spaceId: id,
        success: !!updatedSpace,
      });

      return updatedSpace;
    } catch (error) {
      this.logger.error('스페이스 정보 업데이트 실패', {
        method: 'updateBySpace',
        spaceId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findBySpace(id: string) {
    try {
      this.logger.log('스페이스 정보 조회 시작', {
        method: 'findBySpace',
        spaceId: id,
      });

      const space = await this.spaceModel.findOne({ id }).exec();

      if (!space) {
        this.logger.error(`ID가 ${id}인 스페이스를 찾을 수 없습니다.`);
        throw new BadRequestException(ERROR_MESSAGES.NOTE.NOT_FOUND);
      }

      this.logger.log('스페이스 정보 조회 완료', {
        method: 'findBySpace',
        spaceId: id,
        found: !!space,
      });

      return space;
    } catch (error) {
      this.logger.error('스페이스 정보 조회 실패', {
        method: 'findBySpace',
        spaceId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}