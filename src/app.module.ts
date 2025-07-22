import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResourceModule } from './api/controllers/resources/resource.module';
import { AuthentificationModule } from './api/controllers/authentification/authentification.module';
import { AuthMiddleware } from './api/middlewares/auth.middlewares';
import { AuthentificationController } from './api/controllers/authentification/authentification.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : process.env.NODE_ENV === 'production' ? '.env' : '.env.development.local',
      isGlobal: true
    }),
    ResourceModule,
    AuthentificationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path : 'auth/(.*)' , method : RequestMethod.DELETE});
  }
}
