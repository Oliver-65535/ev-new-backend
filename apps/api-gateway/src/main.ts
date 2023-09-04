import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { MicroservicesConfig } from '@app/configuration';
import { SwaggerModule } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import authSwagger from '../../../swagger-files/AuthenticationModule.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import articleSwagger from '../../../swagger-files/ArticleApiModule.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fileStoreSwagger from '../../../swagger-files/FileStoreModule.json';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, { bodyParser: true });

  //@ts-ignore
  SwaggerModule.setup('/swagger/auth', app, authSwagger);
  //@ts-ignore
  SwaggerModule.setup('/swagger/article', app, articleSwagger);
  //@ts-ignore
  SwaggerModule.setup('/swagger/article', app, fileStoreSwagger);

  const authModule = Object.keys(authSwagger.paths);
  const articleModule = Object.keys(articleSwagger.paths);
  const fileStoreModule = Object.keys(fileStoreSwagger.paths);

  app.use(function (req, res, next) {
    console.debug('=====START=====');
    console.log(req.originalUrl);
    console.log(req.body);
    console.debug('=====END=====');
    return next();
  });

  app.use(
    authModule,
    createProxyMiddleware({
      target: MicroservicesConfig['auth'].url,
      changeOrigin: true,
    }),
  );

  app.use(
    articleModule,
    createProxyMiddleware({
      target: MicroservicesConfig['articleApi'].url,
      changeOrigin: true,
    }),
  );

  app.use(
    fileStoreModule,
    createProxyMiddleware({
      target: MicroservicesConfig['fileStore'].url,
      changeOrigin: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
