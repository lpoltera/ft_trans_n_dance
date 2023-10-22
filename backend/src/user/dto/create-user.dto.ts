import {IsEmail, IsNotEmpty, IsStrongPassword, Length, IsMobilePhone, IsOptional, buildMessage } from 'class-validator';
import { Friendship } from 'src/friends/entities/friends.entity';
export class CreateUserDto {

	readonly id: number;
	@Length(3, 15 ,{
		message: 'Name length must be between $constraint1 and $constraint2 characters\n',
	  })
	@IsNotEmpty({ message: 'Username should not be empty\n'})
	readonly username: string;
	
	@IsStrongPassword({}, { message: 'Invalid password\n'})
	readonly password: string;

	// @IsEmail({}, { message: 'Invalid email message'})
	// readonly email: string;

	readonly avatar?: string;

	readonly connected?: string;

	readonly friends?: Friendship[];
}
