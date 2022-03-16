import { Types } from 'mongoose';
import { BasePost } from '../domain/post';

export type PostDto = BasePost & {
  _id: Types.ObjectId;
};
