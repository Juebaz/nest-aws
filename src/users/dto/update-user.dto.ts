import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  userName: string;
}
