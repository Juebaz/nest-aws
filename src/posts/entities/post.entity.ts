import { Schema } from 'mongoose';
import { Post } from '../domain/post';

export const PostSchema = new Schema<Post>({
  userId: String,
  description: String,
  imageUrl: String,
  hashtags: [String],
  taggedUsers: [String],
  creationDate: String,
});
