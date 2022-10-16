import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CameraSchema } from './schema/camera.schema';
import { CameraService } from './camera/camera.service';
import { CameraController } from './camera/camera.controller';
import { ExportCsvController } from './exportCSV/export_csv.controller';
import { ExportCsvService } from './exportCSV/export_csv.service';
import { SchedulerController } from './scheduler/scheduler.controller';
import { SchedulerService } from './scheduler/scheduler.service';
import { SchedulerSchema } from './schema/scheduler.schema';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HistoryCameraService } from './history_camera/history_camera.service';
import { HistoryCameraSchema } from './schema/history_camera.schema';
import { OnvifService } from './onvif/onvif.service';
import { ChangedCameraService } from './changedCamera/changedCamera.service';
import { OnvifController } from './onvif/onvif.controller';

import { Camera } from './camera/camera.entity';
import { Scheduler } from './scheduler/scheduler.entity';
import { HistoryCamera } from './history_camera/history_camera.entity';
import { ChangedCamera } from './changedCamera/changedCamera.entity';
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true, }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'onvif_db',
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([Camera, Scheduler,HistoryCamera,ChangedCamera]),
    ScheduleModule.forRoot()
  ],
  controllers: [
    AppController, CameraController,
    SchedulerController,
    OnvifController,ExportCsvController
  ],
  providers: [
    AppService, CameraService,
    SchedulerService,
    CronService,
    HistoryCameraService,
    OnvifService,
    ChangedCameraService,
    ExportCsvService
  ],
})
export class AppModule { }
