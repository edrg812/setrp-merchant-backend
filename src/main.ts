
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS (important for frontend requests)
  app.enableCors({
    origin: true, // allow all origins (change in production)
    credentials: true,
  });

  // ✅ Global validation (CRITICAL for DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove extra fields
      forbidNonWhitelisted: true, // throw error on unknown fields
      transform: true,            // auto-transform payloads
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();
