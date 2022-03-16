import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserId } from 'src/users/domain/user-id';
import { Post } from './domain/post';
import { PostId } from './domain/post-id';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostDoesNotExistException } from './exceptions/post-does-not-exists.exception';
import { PostMapper } from './mappers/post.mapper';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    private readonly postsMapper: PostMapper,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const newPost = this.postsMapper.createDtoToPost(createPostDto);
    const createdPost = await this.postModel.create(newPost);
    return this.postsMapper.postDtoToPostResponse(createdPost);
  }

  async findAllByDate(): Promise<Post[]> {
    const res = await this.postModel.find().sort({ creationDate: -1 }).exec();
    return res.map(this.postsMapper.postDtoToPostResponse);
  }

  async findAll() {
    const res = await this.postModel.find();
    return res.map(this.postsMapper.postDtoToPostResponse);
  }

  async findOne(id: PostId) {
    const postDto = await this.postModel.findById(id).exec();

    if (postDto) {
      return this.postsMapper.postDtoToPostResponse(postDto);
    }
    throw new PostDoesNotExistException();
  }

  async findForOneUser(uId: UserId) {
    const res = await this.postModel.find().exec();
    if (res) {
      return res
        .filter((post: Post) => post.userId == uId)
        .map(this.postsMapper.postDtoToPostResponse);
    }
    throw new PostDoesNotExistException();
  }

  async editPost(id: PostId, updatePostDto: UpdatePostDto) {
    const updatePost = this.postsMapper.updateDtoToPost(updatePostDto);

    const res = await this.postModel.findByIdAndUpdate(
      id,
      { $set: updatePost },
      { returnOriginal: false },
    );

    if (!res) {
      throw new PostDoesNotExistException();
    }

    return this.postsMapper.postDtoToPostResponse(res);
  }

  async remove(id: PostId) {
    const post = await this.postModel.findById(id);
    if (post) {
      await post.remove();
    } else {
      throw new PostDoesNotExistException();
    }
  }

  async removeTaggedUsers(id: PostId, userId: string) {
    const res = await this.postModel
      .findOneAndUpdate(
        {
          _id: Object(id),
          taggedUsers: Object(userId),
        },
        {
          $pull: {
            taggedUsers: Object(userId),
          },
        },
        {
          new: true,
        },
      )
      .then()
      .catch();
  }
  
  async search(description?: string, hashtag?: string) {
    const descriptionQuery = description ?? '';
    const hashtagQuery = hashtag ?? '';

    const posts = await this.postModel.find({
      hashtags: { $regex: hashtagQuery },
      description: { $regex: descriptionQuery },
    });

    return posts.map(this.postsMapper.postDtoToPostResponse);
  }
}
