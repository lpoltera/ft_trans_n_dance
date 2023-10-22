import { IsNotEmpty } from "class-validator";

export class CreateMatchsHistoryDto {
	
	@IsNotEmpty({ message: 'Please choose an opponent\n'})
	readonly id_p2: number;
	
	//game params
	//...
  
  
}
