import { IsNotEmpty } from 'class-validator';

export class CreateTournamentDto {
  @IsNotEmpty({ message: 'Please choose a name' })
  name: string;

  @IsNotEmpty({ message: 'Please select participants\n' })
  participants: string[];

  @IsNotEmpty({ message: 'Please choose a difficulty\n' })
  difficulty: string;

  @IsNotEmpty({ message: 'Please choose a mode\n' })
  mode: string;

  @IsNotEmpty({ message: 'Please choose a powerUps\n' })
  power_ups: string;
}
