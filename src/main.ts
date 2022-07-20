import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // to set validation pipe executed globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // to make dto only proccessing defined object structure
    }),
  );
  await app.listen(3333);
}
bootstrap();
