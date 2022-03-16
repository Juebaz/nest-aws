import { PostId } from './post-id';

export type Post = BasePost & {
  id: PostId;
};

export type BasePost = {
    userId: string,
    description: string,
    imageUrl: string,
    hashtags: string[],
    taggedUsers: string[],
    creationDate: string
};

export type UpdatePost = {
    description: string;
    hashtags: string[];
    taggedUsers: string[];
};