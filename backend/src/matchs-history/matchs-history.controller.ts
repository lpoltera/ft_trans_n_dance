import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
} from '@nestjs/common';
import { MatchsHistoryService } from './matchs-history.service';
import { CreateMatchsHistoryDto } from './dto/create-matchs-history.dto';
import { UpdateMatchsHistoryDto } from './dto/update-matchs-history.dto';
import { countReset } from 'console';

@Controller('api/game')
export class MatchsHistoryController {
  constructor(private readonly matchsHistoryService: MatchsHistoryService) {}

  @Post('/create')
  create(
    @Body() createMatchDto: CreateMatchsHistoryDto,
    @Session() sessionUser: Record<string, any>,
  ) {
    return this.matchsHistoryService.create(createMatchDto, sessionUser.user.id);
  }

  // @Get()
  // findAll() {
  //   return this.matchsHistoryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.matchsHistoryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateMatchsHistoryDto: UpdateMatchsHistoryDto,
  // ) {
  //   return this.matchsHistoryService.update(+id, updateMatchsHistoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.matchsHistoryService.remove(+id);
  // }
}
