import { IsOptional, IsStrongPassword, Length } from 'class-validator';

export class UpdateUserDto {
  readonly avatar?: string;

  @IsOptional()
  @Length(3, 15, {
    message:
      'Name length must be between $constraint1 and $constraint2 characters\n',
  })
  readonly username?: string;

  @IsOptional()
  @IsStrongPassword({}, { message: 'Invalid password\n' })
  readonly password?: string | null;
}
