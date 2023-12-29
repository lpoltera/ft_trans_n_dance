import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchsHistoryDto } from './create-matchs-history.dto';

export class UpdateMatchsHistoryDto {
  score_p1: number;
  score_p2: number;
  status?: string;
  time?: number;
}
