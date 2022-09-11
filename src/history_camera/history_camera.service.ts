import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IHistoryCamera } from 'src/interface/history_camera.interface';
import { CreateHistoryCameraDto } from 'src/dto/create-history_camera.dto';
import { ICamera } from 'src/interface/camera.interface';

@Injectable()
export class HistoryCameraService {
    constructor(@InjectModel('history_camera_data') private historyCameraModel: Model<IHistoryCamera>) { }
    async createHistoryCamera(historyCameraData: ICamera[], timeHr: string, timeMin: string): Promise<IHistoryCamera> {

        let newHistoryCameraDto = {} as IHistoryCamera;
        newHistoryCameraDto.cameras = historyCameraData;
        newHistoryCameraDto._uuid = new Date().toLocaleDateString() + `/${timeHr}/${timeMin}`;
        newHistoryCameraDto.createAt = new Date().toISOString();
        const newHistoryCamera = new this.historyCameraModel(newHistoryCameraDto);
        return newHistoryCamera.save();
    }


    // async getAllCamera(): Promise<IHistoryCamera[]> {
    //     const cameraData = await this.cameraModel.find();
    //     if (!cameraData || cameraData.length == 0) {
    //         throw new NotFoundException('Camera data not found!');
    //     }
    //     return cameraData;
    // }

    // async getCamera(cameraId: string): Promise<IHistoryCamera> {
    //     const existingCamera = await this.cameraModel.findById(cameraId).exec();
    //     if (!existingCamera) {
    //         throw new NotFoundException(`Camera #${cameraId} not found`);
    //     }
    //     return existingCamera;
    // }

}