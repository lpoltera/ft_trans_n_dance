import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMatchsHistoryDto {
  name_p2: string;

  @IsNotEmpty({ message: 'Please choose a difficulty\n' })
  difficulty: string;

  @IsNotEmpty({ message: 'Please choose a mode\n' })
  mode: string;

  @IsNotEmpty({ message: 'Please choose a powerUps\n' })
  powerUps: string;
}
