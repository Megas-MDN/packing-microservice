import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global usando os DTOs
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.enableCors();

  //  Swagger
  const config = new DocumentBuilder()
    .setTitle('Packing API')
    .setDescription('API para empacotar produtos nas caixas disponíveis')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document); // <== define a rota /doc

  // Porta da API
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`API rodando em: http://localhost:${PORT}`);
  console.log(`Swagger disponível em: http://localhost:${PORT}/doc`);
}
bootstrap();
