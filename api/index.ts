import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const server = express();

let appInit = false;
let nestApp: any;

async function bootstrap() {
  if (!appInit) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    // Configurações do seu app
    app.enableCors();
    app.setGlobalPrefix('api'); // Opcional

    await app.init();
    nestApp = app;
    appInit = true;
  }

  return server;
}

export default async (req: express.Request, res: express.Response) => {
  const app = await bootstrap();
  return app(req, res);
};
