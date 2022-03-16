import { Injectable } from '@nestjs/common';
import { UserModel } from '../entities/user.entity';
import { UserResponse } from '../response/user-response';

@Injectable()
export class UsersMapper {
  toUserResponse(userDto: UserModel): UserResponse {
    return {
      id: userDto._id.toString(),
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      creationDate: userDto.creationDate,
      avatar: userDto.avatar,
      userName: userDto.userName,
      phoneNumber: userDto.phoneNumber,
      email: userDto.email,
    };
  }
}
