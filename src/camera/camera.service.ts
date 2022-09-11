import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCameraDto } from '../dto/create-camera.dto';
import { ICamera } from '../interface/camera.interface';
import { Model } from "mongoose";
import { UpdateCameraDto } from '../dto/update-camera.dto';

@Injectable()
export class CameraService {
    constructor(@InjectModel('camera_data') private cameraModel: Model<ICamera>) { }
    async createCamera(createCameraDto: CreateCameraDto): Promise<ICamera> {
        const newCamera = await new this.cameraModel(createCameraDto);
        const existingCamera = await this.cameraModel.findOne({ ipCamera: newCamera.ipCamera });
        
        if (existingCamera) {
            throw new ConflictException(`camera is already exist`);
        }
        newCamera.status = false;
        newCamera.model = 'FX505';
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
}