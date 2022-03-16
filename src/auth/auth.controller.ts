import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isNone } from 'fp-ts/lib/Option';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersMapper } from 'src/users/mappers/users-mapper';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { validateGoogleToken } from './google.service';

type AuthorizationRequest = { token: string };
type LocalAuthPayload = { email: string; password: string };

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private userMapper: UsersMapper,
  ) {}

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('/login')
  async login(@Body() body: LocalAuthPayload) {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
    );

    if (isNone(user)) {
      throw new UnauthorizedException();
    }

    return {
      user: this.userMapper.toUserResponse(user.value),
      accessToken: this.jwtService.sign({
        email: user.value.email,
        userId: user.value._id,
      }),
    };
  }

  @Post('/google')
  public async googleLogin(@Body() body: AuthorizationRequest) {
    const { token } = body;

    const googleInfo = await validateGoogleToken(token);
    const user = await this.authService.signInWithGoogle(googleInfo);

    return {
      user: user,
      accessToken: this.jwtService.sign({ email: user.email, userId: user.id }),
    };
  }
}
