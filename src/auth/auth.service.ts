import { Injectable } from '@nestjs/common';
import { none, Option, some } from 'fp-ts/lib/Option';
import { compare } from 'src/commons/encryption.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserModel } from 'src/users/entities/user.entity';
import { UsersMapper } from 'src/users/mappers/users-mapper';
import { UserResponse } from 'src/users/response/user-response';
import { UsersService } from 'src/users/users.service';
import { GoogleInfo } from './google.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userMapper: UsersMapper,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Option<UserModel>> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return none;
    }

    if (await compare(password, user.password)) {
      return some(user);
    }

    return none;
  }

  async signInWithGoogle(googleInfo: GoogleInfo): Promise<UserResponse> {
    const currentUser = await this.usersService.findByEmail(googleInfo.email);

    if (!currentUser) {
      return await this.createUserFromGoogleAccount(googleInfo);
    }

    return this.userMapper.toUserResponse(currentUser);
  }

  createUserFromGoogleAccount = async ({
    email,
    familyName,
    givenName,
    picture,
  }: GoogleInfo): Promise<UserResponse> => {
    const user: CreateUserDto = {
      email: email,
      firstName: givenName,
      lastName: familyName,
      avatar: picture,
      userName: familyName + givenName,
      phoneNumber: '',
      password: '',
    };
    return await this.usersService.create(user);
  };
}
