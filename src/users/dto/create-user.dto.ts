import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 15)
  userName: string;

  @IsNotEmpty()
  @Length(2, 20)
  firstName: string;

  @IsNotEmpty()
  @Length(2, 20)
  lastName: string;

  @IsNotEmpty()
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(/\d{3}-\d{3}-\d{4}$/, {
    message: 'phone number must be a valid phone number',
  })
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
