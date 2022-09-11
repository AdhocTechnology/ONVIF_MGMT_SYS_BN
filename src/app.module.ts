import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { CameraSchema } from './schema/camera.schema';
import { CameraService } from './camera/camera.service';
import { CameraController } from './camera/camera.controller';
import { SchedulerController } from './scheduler/scheduler.controller';
import { SchedulerService } from './scheduler/scheduler.service';
import { SchedulerSchema } from './schema/scheduler.schema';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HistoryCameraService } from './history_camera/history_camera.service';
import { HistoryCameraSchema } from './schema/history_camera.schema';
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({envFilePath,isGlobal: true,}),
    MongooseModule.forRoot('mongodb://localhost/ONVIF_SYS'),
    MongooseModule.forFeature([{ name: 'camera_data', schema: CameraSchema }, { name: 'scheduler_data', schema: SchedulerSchema },
    , { name: 'history_camera_data', schema: HistoryCameraSchema }
  ]),
    // MongooseModule.forRoot('mongodb://localhost:27017',{dbName: 'ONVIF_SYS'}),
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, CameraController, SchedulerController],
  providers: [AppService, CameraService, SchedulerService, CronService, HistoryCameraService],
})
export class AppModule { }
