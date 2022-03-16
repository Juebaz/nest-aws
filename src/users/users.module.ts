import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'src/posts/posts.module';
import { UserSchema } from './entities/user.entity';
import { UsersMapper } from './mappers/users-mapper';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PostsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersMapper],
  exports: [UsersService],
})
export class UsersModule {}
