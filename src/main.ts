import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService= app.get(ConfigService)

  const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'swagger.json'), 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.enableCors({
    origin: ['*'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Removes properties not defined in the DTO
      forbidNonWhitelisted: true,  // Throws an error if any extra properties are found
      transform: true,        // Automatically transforms request payloads to DTO classes
    }),
  );

  const port=configService.get<number>('PORT')
  await app.listen(port || 3000,()=>console.log(`server is listening on the port ${port}...`));
}
bootstrap();
