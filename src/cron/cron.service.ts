import { Injectable, NotFoundException, OnModuleInit, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { HistoryCameraService } from '../history_camera/history_camera.service';
import { CameraService } from '../camera/camera.service';

import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { IScheduler } from '../interface/scheduler.interface';
@Injectable()
export class CronService {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private readonly historyCameraService: HistoryCameraService,
        private readonly cameraService: CameraService,
        @InjectModel('scheduler_data') private schedulerModel: Model<IScheduler>,) {
    }
    
    async setupAllCrons() {
        const SchedulerArr = await this.getAllScheduler();
        SchedulerArr.forEach((element, i) => {
            // console.log(`count ${i}`);
            this.addCronJob(element._id, element.timeHr, element.timeMin);
        });
    }

    getAllCronsId() {
        try {
            const jobs = this.schedulerRegistry.getCronJobs();
            let res = [];
            jobs.forEach((value, key) => {
                res.push(`${key}`);
            });
            return res;
        } catch (error) {
            console.log(error);
        }

    }

    async getAllScheduler(): Promise<IScheduler[]> {
        const schedulerData = await this.schedulerModel.find();
        if (!schedulerData || schedulerData.length == 0) {
            throw new NotFoundException('Scheduler data not found!');
        }
        return schedulerData;
    }

    addCronJob(_id: string, hour: string, min: string) {
        const job = new CronJob(`0 ${min} ${hour} * * *`, async () => {
            console.log('keep log');
            const allCameraData = await this.cameraService.getAllCamera();
            await this.historyCameraService.createHistoryCamera(allCameraData, hour, min);
        });
        try {
            this.schedulerRegistry.addCronJob(_id.toString(), job);
        } catch (error) {
            console.log(error);
        }

        console.log(`job ${_id} added !`);
        job.start();
    }

    deleteCron(name: string) {
        try {
            this.schedulerRegistry.deleteCronJob(name);
        } catch (error) {
            console.log(error);
        }


        console.log(`job ${name} deleted!`);
    }
}