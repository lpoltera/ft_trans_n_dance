import { IsNotEmpty, IsString} from "class-validator";

export class CreateMatchsHistoryDto {
	
	@IsNotEmpty({ message: 'Please choose an opponent\n'})
	@IsString()
	name_p2: string;
	
	// @IsString()
	// readonly name_p1: string;
	
	//game params
	//...
  
  
}
