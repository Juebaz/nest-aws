import { BasePost } from '../domain/post';

export type PostResponse = BasePost & {
  id: string;
  creationDate: string;
};
