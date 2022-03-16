import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './commons/exceptions-filters/custom-exception.filter';
async function bootstrap() {
  const port = process.env.PORT || 8080;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableCors({
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(port);

  console.log(`listening on port ${port}...`);
}
bootstrap();
