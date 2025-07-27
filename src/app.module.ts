import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResourceModule } from './api/controllers/resources/resource.module';
import { AuthentificationModule } from './api/controllers/authentification/authentification.module';
import { AuthMiddleware } from './api/middlewares/auth.middlewares';
import { ManagementModule } from './api/controllers/management/management.module';
import { CustomerController } from './api/controllers/management/customer.controller';
import { APP_GUARD } from '@nestjs/core';
import { EntityTypeGuard } from './core/guards/entity_type.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : process.env.NODE_ENV === 'production' ? '.env' : '.env.development.local',
      isGlobal: true
    }),
    ResourceModule,
    AuthentificationModule,
    ManagementModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path : 'auth/(.*)' , method : RequestMethod.DELETE})
      .apply(AuthMiddleware)
      .forRoutes(CustomerController)
  }
}
