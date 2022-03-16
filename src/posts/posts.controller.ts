import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseFilters,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UserId } from 'src/users/domain/user-id';
import { CustomExceptionFilter } from 'src/commons/exceptions-filters/custom-exception.filter';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostId } from './domain/post-id';

@Controller('posts')
@UseFilters(new CustomExceptionFilter())
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAllByDate();
  }

  @Get('search')
  async search(
    @Query('description') description: string,
    @Query('hashtag') hashtag: string,
  ) {
    return this.postsService.search(description, hashtag);
  }

  @Get(':id')
  findOne(@Param('id') id: PostId) {
    return this.postsService.findOne(id);
  }

  @Get('user/:uid')
  findForOneUser(@Param('uid') uId: UserId) {
    return this.postsService.findForOneUser(uId);
  }

  @Put(':id')
  editPost(@Param('id') id: PostId, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.editPost(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UserId) {
    return this.postsService.remove(id);
  }
}
