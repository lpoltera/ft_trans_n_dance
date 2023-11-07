import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as connectPgSimple from 'connect-pg-simple';
import * as session from 'express-session';
import { AppModule } from './app.module';
import Pool = require('pg-pool');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      store: new (connectPgSimple(session))({
        createTableIfMissing: true,
        pool: new Pool({
          user: process.env.BACKEND_USER,
          password: process.env.BACKEND_PASSWORD,
          host: process.env.POSTGRES_HOST,
          database: process.env.POSTGRES_DB,
          port: +process.env.POSTGRES_PORT,
        }),
        tableName: 'sessions',
      }),
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
        sameSite: 'lax', // TODO for google chrome
        // TODO secure: true (for https) 
      },
    }),
  );
  // app.use(sessionMiddleware);
  await app.listen(4000);
}
bootstrap();
