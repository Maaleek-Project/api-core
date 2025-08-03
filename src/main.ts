import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HandleValidationBodyRequest } from './validators/body-request.validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      return new HandleValidationBodyRequest(errors);
    },
  }));

  app.enableCors();

  await app.listen(process.env.PORT ?? 3384);
}
bootstrap();
