import { NestFactory } from '@nestjs/core';
import { Logger, NestInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppKey, IMicroservice } from '@app/configuration/interfaces';
import { ResponseInterceptor } from '@app/common';
import { writeFile } from 'fs/promises';
import { MicroservicesConfig } from '@app/configuration';

class Microservice {
  private appKey: AppKey;
  private config: IMicroservice;
  private app: NestExpressApplication;
  private logger: Logger;

  constructor(private appModule: any) {
    this.getAppKey();
    this.setupLogger();
    this.getConfig();
  }

  private getAppKey() {
    this.appKey = Reflect.getMetadata('appKey', this.appModule);
    if (!this.appKey) {
      throw new Error(
        `Class ${this.appModule.name} missing appKey metadata property`,
      );
    }
  }

  private setupLogger() {
    const ctx = `${this.appKey.replace(/^\w/, c =>
      c.toUpperCase(),
    )}Microservice`;
    this.logger = new Logger(ctx, { timestamp: true });
  }

  private getConfig() {
    this.config = MicroservicesConfig[this.appKey];
    if (!this.config) {
      throw new Error(`Missing config for microservice ${this.appKey}`);
    }
  }

  async run() {
    try {
      this.app = await NestFactory.create<NestExpressApplication>(
        this.appModule,
      );

      this.setupMiddlewares();
      this.setupPipes();
      this.setupInterceptors();
      this.setupCors();
      await this.setupDocumentation();

      if (this.config.shutdownHooks) {
        this.logger.log('Shutdown hooks enabled');
        this.app.enableShutdownHooks();
      }

      await this.app.listen(this.config.port);
      this.logger.log(`Listening on port ${this.config.port}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async setupDocumentation() {
    const openApiConfig = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Archon API')
      .setDescription('backend for archon service')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(this.app, openApiConfig);
    SwaggerModule.setup('swagger', this.app, document);
    await writeFile(
      `swagger-files/${this.appModule.name}.json`,
      JSON.stringify(document),
    );
  }

  private setupCors() {
    this.app.enableCors();
  }

  private setupMiddlewares() {
    this.app.use(cookieParser(), bodyParser.text({ type: ['*/xml', '+xml'] }));
  }

  private setupPipes() {
    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }

  private setupInterceptors() {
    const globalInterceptors: NestInterceptor[] = [];
    if (this.config.standardResponse !== false) {
      this.logger.log('Standard response enabled');
      globalInterceptors.push(new ResponseInterceptor());
    }
    this.app.useGlobalInterceptors(...globalInterceptors);
  }
}

export async function bootstrap(appModule: any) {
  await new Microservice(appModule).run();
}
