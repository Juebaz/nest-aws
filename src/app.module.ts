import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { getDatabaseConnectionString } from './initDatabaseConnection';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(getDatabaseConnectionString()),
    UsersModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController]
})
export class AppModule {}
