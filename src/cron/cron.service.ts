import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HistoryCameraService } from '../history_camera/history_camera.service';
import { CameraService, NUMBER_OF_LOOP_CHECKING } from '../camera/camera.service';

import { CronJob } from 'cron';
import { MGetAllDevicesInfo } from '../onvif/onvif.model';
import { IAllDevicesInfoResponse, IAllDevicesResponseWithTime } from '../onvif/onvif.interface';
import { OnvifService } from '../onvif/onvif.service';
import { ChangedCameraService } from '../changedCamera/changedCamera.service';
import { Scheduler } from '../scheduler/scheduler.entity';
import { Camera } from '../camera/camera.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CronService {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private readonly historyCameraService: HistoryCameraService,
        private readonly cameraService: CameraService,
        private readonly onvifService: OnvifService,
        private readonly changedCameraService: ChangedCameraService,
        @InjectRepository(Scheduler)
        private readonly schedulerRepository: Repository<Scheduler>,
        @InjectRepository(Camera)
        private readonly cameraRepository: Repository<Camera>
    ) {
    }

    async setupAllCrons() {
        const SchedulerArr = await this.getAllScheduler();
        SchedulerArr.forEach((element, i) => {
            this.addCronJob(element.id, element.timeHr, element.timeMin);
        });
        this.addCronClearHistory()
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

    async getAllScheduler(): Promise<Scheduler[]> {
        const schedulerData = await this.schedulerRepository.find();
        return schedulerData;
    }

    addCronJob(_id: number, hour: string, min: string) {
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
            //     serialNumber: 2222222,
            //     hardwareId: 'F000A043',
            //     ipCamera: '192.255.255.12',
            //     port: 80
            // }, {
            //     manufacturer: 'Bosch',
            //     model: 'DINION IP 4000i IR',
            //     firmwareVersion: '6.60.0065',
            //     serialNumber: 33333333,
            //     hardwareId: 'F000A043',
            //     ipCamera: '192.168.1.4',
            //     port: 81
            // }];
            const allCameraIp = oldCameraData.map(x => x.ipCamera);
            const camerasConnected = responseDevices.filter(obj => allCameraIp.includes(obj.ipCamera));
            await this.cameraService.clearStatus();
            for (let i = 0; i < camerasConnected.length; i++) {

                const oldCameraDetail = await this.cameraService.getCameraWithIP(camerasConnected[i].ipCamera);

                if ((oldCameraDetail.serialNumber !== "") && (oldCameraDetail.serialNumber !== camerasConnected[i].serialNumber.toString())) {

                    const changedCamera = {
                        ipCamera: oldCameraDetail.ipCamera,
                        oldModel: oldCameraDetail.model,
                        oldManufacturer: oldCameraDetail.manufacturer,
                        oldSerialNumber: oldCameraDetail.serialNumber,
                        oldHardwareId: oldCameraDetail.hardwareId,
                        oldFirmwareVersion: oldCameraDetail.firmwareVersion,
                        oldPort: oldCameraDetail.port,

                        newModel: camerasConnected[i].model,
                        newManufacturer: camerasConnected[i].manufacturer,
                        newSerialNumber: camerasConnected[i].serialNumber.toString(),
                        newHardwareId: camerasConnected[i].hardwareId,
                        newFirmwareVersion: camerasConnected[i].firmwareVersion,
                        newPort: camerasConnected[i].port,
                    }
                    await this.changedCameraService.createChangedCamera(changedCamera);
                }

                camerasConnected[i].status = true;
                camerasConnected[i].responseTime = responseTime;
                const filter = { ipCamera: camerasConnected[i].ipCamera };
                const update = camerasConnected[i];
                await this.cameraService.findOneAndUpdate(filter, update);
            }

            const allCameraData = await this.cameraService.getAllCamera();
            await this.historyCameraService.createHistoryCamera(allCameraData, hour, min);
        });
        try {
            this.schedulerRegistry.addCronJob(_id.toString(), job);
        } catch (error) {
            console.log(error);
        }

        console.log(`job ${_id} added !(${hour}:${min})`);
        job.start();
    }

    addCronClearHistory(){
        // const job = new CronJob(`0 58 23 * * *`, async () => {
        const job = new CronJob(`0 58 23 * * *`, async () => {
            console.log('clear old data');
            this.historyCameraService.clearOldData();
        })
        try {
            this.schedulerRegistry.addCronJob('clearHistory', job);
        } catch (error) {
            console.log(error);
        }

        console.log(`job clear history added !(23:58)`);
        job.start();
    }

    deleteCron(name: number) {
        try {
            this.schedulerRegistry.deleteCronJob(name.toString());
        } catch (error) {
            console.log(error);
        }


        console.log(`job ${name} deleted!`);
    }
}