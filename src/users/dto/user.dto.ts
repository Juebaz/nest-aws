import { Types } from 'mongoose';

export type UserDto = {
  userName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  creationDate: string;
  _id: Types.ObjectId;
};
