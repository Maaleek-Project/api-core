import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResourceModule } from './api/controllers/resources/resource.module';
import { AuthentificationModule } from './api/controllers/authentification/authentification.module';

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
export class AppModule {}
