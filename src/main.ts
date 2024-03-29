import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from 'src/pipes/validation.pipe';

async function bootstrap() {
  const PORT = process.env.PORT || 5500;

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest js course')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addTag('OOK')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => {
    console.log(`Server has been started on  http://localhost:${PORT}`);
  });
}

bootstrap();
