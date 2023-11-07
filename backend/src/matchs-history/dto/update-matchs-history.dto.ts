import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchsHistoryDto } from './create-matchs-history.dto';

export class UpdateMatchsHistoryDto extends PartialType(CreateMatchsHistoryDto) {
	
	status: string;
}
