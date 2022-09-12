import { Injectable, NotFoundException, OnModuleInit, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { HistoryCameraService } from '../history_camera/history_camera.service';
import { CameraService, NUMBER_OF_LOOP_CHECKING } from '../camera/camera.service';

import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { IScheduler } from '../interface/scheduler.interface';
import { MGetAllDevicesInfo } from '../onvif/onvif.model';
import { IAllDevicesInfoResponse, IAllDevicesResponseWithTime } from '../onvif/onvif.interface';
import { OnvifService } from '../onvif/onvif.service';
import { ICamera } from '../interface/camera.interface';
@Injectable()
export class CronService {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private readonly historyCameraService: HistoryCameraService,
        private readonly cameraService: CameraService,
        private readonly onvifService: OnvifService,
        @InjectModel('scheduler_data') private schedulerModel: Model<IScheduler>,
        @InjectModel('camera_data') private cameraModel: Model<ICamera>,
    ) {
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


            const oldCameraData: MGetAllDevicesInfo[] = await this.cameraService.getUsernamePasswordCamera();
            const devicesPromise: Promise<IAllDevicesInfoResponse[]>[] = [];
            let devices: IAllDevicesInfoResponse[] = [];
            try {
                if (oldCameraData.length > 0) {
                    for (let i = 0; i < NUMBER_OF_LOOP_CHECKING; i++) {
                        devicesPromise.push(this.onvifService.getAllDevicesInfo(oldCameraData));
                    }
                    const res = await Promise.all(devicesPromise);
                    for (let i = 0; i < res.length; i++) {
                        devices = devices.concat(res[i]);
                    }
                }
            } catch (e) {
                console.log(e);
            }

            let responseData: IAllDevicesResponseWithTime;
            const duplicateIds = devices
                .map(v => v.ipCamera)
                .filter((v, i, vIds) => vIds.indexOf(v) !== i)
            const duplicates = devices
                .filter(obj => duplicateIds.includes(obj.ipCamera));
            const filterObj = duplicates.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.ipCamera === value.ipCamera
                ))
            );
            responseData = {
                devices: filterObj,
                responseTime: new Date()
            }
            if (responseData.devices.length === 0) {
                responseData = {
                    devices: [],
                    responseTime: new Date()
                }
            }

            const responseDevices = responseData.devices;
            const responseTime = responseData.responseTime.toISOString();
            // mockData
            // const responseTime = new Date().toISOString();
            // const responseDevices: IAllDevicesInfoResponse[] = [{
            //     manufacturer: 'Bosch',
            //     model: 'DINION IP 4000i IR',
            //     firmwareVersion: '6.60.0065',
            //     serialNumber: 404516907622012160,
            //     hardwareId: 'F000A043',
            //     ipCamera: '192.255.255.18',
            //     port: 80
            // }, {
            //     manufacturer: 'Bosch',
            //     model: 'DINION IP 4000i IR',
            //     firmwareVersion: '6.60.0065',
            //     serialNumber: 404516907622012160,
            //     hardwareId: 'F000A043',
            //     ipCamera: '192.168.1.4',
            //     port: 80
            // }];
            const allCameraIp = oldCameraData.map(x => x.ipCamera);
            const camerasConnected = responseDevices.filter(obj => allCameraIp.includes(obj.ipCamera));
            await this.cameraModel.updateMany({}, { $set: { status: false } });
            for (let i = 0; i < camerasConnected.length; i++) {
                camerasConnected[i].status = true;
                camerasConnected[i].responseTime = responseTime;
                const filter = { ipCamera: camerasConnected[i].ipCamera };
                const update = camerasConnected[i];
                await this.cameraModel.findOneAndUpdate(filter, update);
            }












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