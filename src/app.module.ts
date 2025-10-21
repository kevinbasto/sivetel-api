import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EndpointsModule } from './endpoints/endpoints.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    EndpointsModule,
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule
      ],
      inject: [
        ConfigService
      ],
      useFactory: (ConfigService: ConfigService) => ({
        type: ConfigService.get<string>('DATA_TYPE') as 'mysql', 
        host: ConfigService.get<string>('DATA_HOST'),
        port: ConfigService.get<number>('DATA_PORT'),
        database: ConfigService.get<string>('DATA_DB'), 
        username: ConfigService.get<string>('DATA_USER'),
        password: ConfigService.get<string>('DATA_PASSWORD'),
        synchronize: true, //ConfigService.get<boolean>('DATA_SYNC'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
