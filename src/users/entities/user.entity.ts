import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema<UserModel>({
  userName: String,
  firstName: String,
  lastName: String,
  avatar: String,
  email: String,
  phoneNumber: String,
  creationDate: String,
  password: String,
});

export type UserModel = {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  creationDate: string;
  password: string;
};
