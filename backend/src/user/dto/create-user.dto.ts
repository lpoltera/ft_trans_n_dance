import {
	IsNotEmpty,
	IsStrongPassword,
	Length
} from 'class-validator';
export class CreateUserDto {
  readonly id: number;
  @Length(3, 15, {
    message:
      'Name length must be between $constraint1 and $constraint2 characters\n',
  })
  @IsNotEmpty({ message: 'Username should not be empty\n' })
  readonly username: string;

  @IsStrongPassword({}, { message: 'Invalid password\n' })
  readonly password: string;

  readonly avatar?: string;
}
