import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCameraDto } from '../dto/create-camera.dto';
import { ICamera } from '../interface/camera.interface';
import { Model } from "mongoose";
import { UpdateCameraDto } from '../dto/update-camera.dto';
import { IAllDevicesInfoResponse, IAllDevicesResponseWithTime } from '../onvif/onvif.interface';
import { OnvifService } from '../onvif/onvif.service';


export const NUMBER_OF_LOOP_CHECKING: number = 3;

@Injectable()
export class CameraService {
    constructor(
        @InjectModel('camera_data')
        private cameraModel: Model<ICamera>,
        private onvifService: OnvifService,
    ) { }
    async createCamera(createCameraDto: CreateCameraDto): Promise<ICamera> {
        const newCamera = await new this.cameraModel(createCameraDto);
        const existingCamera = await this.cameraModel.findOne({ ipCamera: newCamera.ipCamera });

        if (existingCamera) {
            throw new ConflictException(`camera is already exist`);
        }
        newCamera.status = false;
        newCamera.model = '-';
        newCamera.createAt = new Date().toISOString();
        return newCamera.save();
    }
    async updateCamera(cameraId: string, updateCameraDto: UpdateCameraDto): Promise<ICamera> {
        const existingCamera = await this.cameraModel.findByIdAndUpdate(cameraId, updateCameraDto, { new: true });
        if (!existingCamera) {
            throw new NotFoundException(`camera #${cameraId} not found`);
        }
        return existingCamera;
    }
    async getAllCamera(): Promise<ICamera[]> {
        const cameraData = await this.cameraModel.find();
        if (!cameraData || cameraData.length == 0) {
            throw new NotFoundException('Camera data not found!');
        }
        return cameraData;
    }
    async getUsernamePasswordCamera(): Promise<ICamera[]> {
        // username
        // password
        const cameraData = await this.cameraModel.find({}).select(['ipCamera','username','password']);
        if (!cameraData || cameraData.length == 0) {
            throw new NotFoundException('Camera data not found!');
        }
        return cameraData;
    }
    async getCamera(cameraId: string): Promise<ICamera> {
        const existingCamera = await this.cameraModel.findById(cameraId).exec();
        if (!existingCamera) {
            throw new NotFoundException(`Camera #${cameraId} not found`);
        }
        return existingCamera;
    }
    async deleteCamera(cameraId: string): Promise<ICamera> {
        const deletedCamera = await this.cameraModel.findByIdAndDelete(cameraId);
        if (!deletedCamera) {
            throw new NotFoundException(`Camera #${cameraId} not found`);
        }
        return deletedCamera;
    }

    // async updateAllCameraStatus(curData: MGetAllDevicesInfo[]) {
    //     const devicesPromise: Promise<IAllDevicesInfoResponse[]>[] = [];
    //     let devices: IAllDevicesInfoResponse[] = [];
    //     try {
    //         for (let i = 0; i < NUMBER_OF_LOOP_CHECKING; i++) {
    //             devicesPromise.push(this.onvifService.getAllDevicesInfo(curData));
    //         }
    //         const res = await Promise.all(devicesPromise);
    //         for (let i = 0; i < res.length; i++) {
    //             devices = devices.concat(res[i]);
    //         }
    //     } catch (e) {
    //         throw new HttpException({
    //             reason: 'error.get.all.devices.info',
    //             status: HttpStatus.INTERNAL_SERVER_ERROR
    //         }, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }

    //     let response: IAllDevicesResponseWithTime;
    //     const duplicateIds = devices
    //         .map(v => v.ipCamera)
    //         .filter((v, i, vIds) => vIds.indexOf(v) !== i)
    //     const duplicates = devices
    //         .filter(obj => duplicateIds.includes(obj.ipCamera));
    //     const filterObj = duplicates.filter((value, index, self) =>
    //         index === self.findIndex((t) => (
    //             t.ipCamera === value.ipCamera
    //         ))
    //     );
    //     response = {
    //         devices: filterObj,
    //         responseTime: new Date()
    //     }
    //     if (response.devices.length === 0) {
    //         response = {
    //             devices: []
    //         }
    //     }
    //     return response;
    // }
}