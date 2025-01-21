import { Controller, Delete, Param, Version } from '@nestjs/common';

@Controller('lb')
export class LoadbalancerController {
  @Version('1')
  @Delete('/:id')
  async deleteNote(@Param('id') id: string) {}
}
