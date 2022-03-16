import { IsNotEmpty } from "class-validator";

export class CreatePostDto  {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  imageUrl: string;
  @IsNotEmpty()
  hashtags: string[];
  @IsNotEmpty()
  taggedUsers: string[];
  }
  