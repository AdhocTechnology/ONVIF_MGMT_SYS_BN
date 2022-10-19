import { Body, Controller, Delete, Get, HttpException, HttpStatus, OnModuleInit, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CreateCameraDto } from '../dto/create-camera.dto';
import { UpdateCameraDto } from '../dto/update-camera.dto';
import { CameraService, NUMBER_OF_LOOP_CHECKING } from './camera.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IAllDevicesInfoResponse, IAllDevicesResponseWithTime } from '../onvif/onvif.interface';
import { OnvifService } from '../onvif/onvif.service';
import { ChangedCameraService } from '../changedCamera/changedCamera.service';
import { MGetAllDevicesInfo } from '../onvif/onvif.model';
import { Camera } from './camera.entity';
@UseGuards(JwtAuthGuard)
@Controller('camera')
export class CameraController {
    constructor(
        private readonly cameraService: CameraService,
        private readonly onvifService: OnvifService,
        private readonly changedCameraService: ChangedCameraService,
    ) {

    }

    @Post()
    async createCamera(@Res() response, @Body() createCameraDto: CreateCameraDto): Promise<Camera> {
        try {
            const newCamera = await this.cameraService.createCamera(createCameraDto);
            return response.status(HttpStatus.CREATED).json({
                message: 'Camera has been created successfully',
                newCamera,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Put('/:id')
    async updateCamera(@Res() response, @Param('id') cameraId: number,
        @Body() updateCameraDto: UpdateCameraDto) {
        try {
            const existingCamera = await this.cameraService.updateCamera(cameraId, updateCameraDto);
            return response.status(HttpStatus.OK).json({
                message: 'Camera has been successfully updated',
                existingCamera,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get()
    async getAllCamera(@Res() response) {
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
            throw new HttpException({
                reason: 'error.get.all.devices.info',
                status: HttpStatus.INTERNAL_SERVER_ERROR
            }, HttpStatus.INTERNAL_SERVER_ERROR);
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

        const responseDevices: IAllDevicesInfoResponse[] = responseData.devices;
        const responseTime = responseData.responseTime.toISOString();
        // mockData
        // const responseTime = new Date().toISOString();
        // const responseDevices: IAllDevicesInfoResponse[] = [{
        //     manufacturer: 'Bosch',
        //     model: 'DINION IP 4000i IR',
        //     firmwareVersion: '6.60.0065',
        //     serialNumber: 99999999999999999999998,
        //     hardwareId: 'F000A043',
        //     ipCamera: '192.168.1.255',
        //     port: 80
        // }, {
        //     manufacturer: 'Bosch',
        //     model: 'DINION IP 4000i IR',
        //     firmwareVersion: '6.60.0065',
        //     serialNumber: 99999999999999999999997,
        //     hardwareId: 'F000A043',
        //     ipCamera: '192.255.255.12',
        //     port: 80
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

        try {
            const cameraData = await this.cameraService.getAllCamera();
            return response.status(HttpStatus.OK).json({
                message: 'All camera data found successfully', cameraData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get('/:id')
    async getCamera(@Res() response, @Param('id') cameraId: number) {
        try {
            const existingCamera = await
                this.cameraService.getCamera(cameraId);
            return response.status(HttpStatus.OK).json({
                message: 'Camera found successfully', existingCamera,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }


    @Delete('/:id')
    async deleteCamera(@Res() response, @Param('id') cameraId: number) {
        try {
            const deletedCamera = await this.cameraService.deleteCamera(cameraId);
            return response.status(HttpStatus.OK).json({
                message: 'Camera deleted successfully',
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

}