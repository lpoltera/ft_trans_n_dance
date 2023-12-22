import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import {
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from "class-validator";

// export class UpdateUserDto extends PartialType(CreateUserDto) {
export class UpdateUserDto {
  @IsOptional()
  readonly avatar?: string;

  //   @IsOptional()
  readonly username?: string;

  // @IsOptional({ each: true })
  // @ValidateIf(o => o.otherProperty !== 'empty')
  @IsOptional()
  @IsStrongPassword({}, { message: "Invalid password\n" })
  readonly password?: string | null;
}
