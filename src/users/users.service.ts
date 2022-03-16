import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isLeft } from 'fp-ts/lib/Either';
import { Model } from 'mongoose';
import { encrypt } from 'src/commons/encryption.service';
import { PostsService } from 'src/posts/posts.service';
import { UserId } from './domain/user-id';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserModel } from './entities/user.entity';
import { EmailAlreadyExistsException } from './exceptions/email-already-exists.exception';
import { UserDoesNotExistException } from './exceptions/user-does-not-exist.exception';
import { UsernameAlreadyExistsException } from './exceptions/username-already-exists.exception';
import { UsersMapper } from './mappers/users-mapper';
import { UserResponse } from './response/user-response';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    private readonly usersMapper: UsersMapper,
    private readonly postsService: PostsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    await this.validateCreateUserDto(createUserDto);

    const hashedPassword = await encrypt(createUserDto.password);

    if (isLeft(hashedPassword)) {
      throw new InternalServerErrorException();
    }
    const creationDate = new Date().toISOString();

    const createdUser = await this.userModel.create({
      ...createUserDto,
      creationDate: creationDate,
      password: hashedPassword.right,
    });

    return this.usersMapper.toUserResponse(createdUser);
  }

  async findAll(): Promise<UserResponse[]> {
    const res = await this.userModel.find().exec();
    return res.map(this.usersMapper.toUserResponse);
  }

  async findOne(id: UserId) {
    const userDto = await this.userModel.findById(id).exec();

    if (userDto) {
      return this.usersMapper.toUserResponse(userDto);
    }

    throw new UserDoesNotExistException();
  }

  async findByEmail(email: String): Promise<UserModel | undefined> {
    const userDto = await this.userModel.findOne({ email: email }).exec();

    if (userDto) {
      return userDto;
    }

    return undefined;
  }

  async update(id: UserId, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UserDoesNotExistException();
    }

    if (user.email != updateUserDto.email) {
      await this.validateExistingEmail(updateUserDto.email);
    }

    const res = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { returnOriginal: false },
    );

    if (!res) {
      throw new UserDoesNotExistException();
    }

    return this.usersMapper.toUserResponse(res);
  }

  async remove(id: UserId) {
    const user = await this.userModel.findById(id);
    if (user) {
      await user.remove();
      await this.deleteUsersAssociatedPosts(id);
      await this.deleteAssociatedTaggedUsers(id);
    } else {
      throw new UserDoesNotExistException();
    }
  }

  async search(userName?: string, firstName?: string, lastName?: string) {
    const userNameQuery = userName ?? '';
    const firstNameQuery = firstName ?? '';
    const lastNameQuery = lastName ?? '';

    const users = await this.userModel.find({
      userName: { $regex: userNameQuery },
      firstName: { $regex: firstNameQuery },
      lastName: { $regex: lastNameQuery },
    });

    return users.map(this.usersMapper.toUserResponse);
  }

  async validateCreateUserDto(createUserDto: CreateUserDto): Promise<void> {
    await this.validateExistingEmail(createUserDto.email);
  }

  async validateExistingEmail(email: String) {
    const existingEmail = await this.userModel.findOne({
      email: email,
    });
    if (existingEmail != null) {
      throw new EmailAlreadyExistsException();
    }
  }

  async validateExistingUserName(userName: String) {
    const existingUserName = await this.userModel.findOne({
      userName: userName,
    });
    if (existingUserName != null) {
      throw new UsernameAlreadyExistsException();
    }
  }

  async deleteUsersAssociatedPosts(id: string) {
    const postsList = await this.postsService.findForOneUser(id);
    postsList.forEach((post) => this.postsService.remove(post.id));
  }

  async deleteAssociatedTaggedUsers(userId: string) {
    const postsList = await this.postsService.findAll();
    postsList.forEach((post) =>
      this.postsService.removeTaggedUsers(post.id, userId),
    );
  }
}
