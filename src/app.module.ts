import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResourceModule } from './api/controllers/resources/resource.module';
import { AuthentificationModule } from './api/controllers/authentification/authentification.module';
import { AuthMiddleware } from './api/middlewares/auth.middlewares';
import { ManagementModule } from './api/controllers/management/management.module';
import { CustomerController } from './api/controllers/management/customer.controller';
import { CompanyController } from './api/controllers/management/company.controller';
import { CorporateModule } from './api/controllers/corporation/corporation.module';
import { WorkerController } from './api/controllers/corporation/worker.controller';
import { SetupController } from './api/controllers/management/setup.controller';
import { UserModule } from './api/controllers/customer/customer.module';
import { UserController } from './api/controllers/customer/user.controller';
import { MainController } from './api/controllers/customer/main.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : process.env.NODE_ENV === 'production' ? '.env' : '.env.development.local',
      isGlobal: true
    }),
    ResourceModule,
    AuthentificationModule,
    ManagementModule,
    CorporateModule,
    UserModule
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'auth/(.*)', method: RequestMethod.DELETE },
        CustomerController,
        CompanyController,
        WorkerController,
        SetupController,
        UserController,
        MainController,
      );
  }
}
