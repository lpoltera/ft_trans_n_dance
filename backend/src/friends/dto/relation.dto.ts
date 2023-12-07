import { UserResponseDto } from 'src/user/dto/UserResponseDto';

export class relationDto {
  friend: UserResponseDto;
  status: string;
  sender: string;
}
