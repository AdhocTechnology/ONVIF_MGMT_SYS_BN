import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IHistoryCamera } from 'src/interface/history_camera.interface';
import { CreateHistoryCameraDto } from 'src/dto/create-history_camera.dto';
import { ICamera } from 'src/interface/camera.interface';
import { HistoryCamera } from './history_camera.entity';
import { Camera } from '../camera/camera.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class HistoryCameraService {
    constructor(
        @InjectRepository(HistoryCamera)
        private readonly historyCameraRepository: Repository<HistoryCamera>
    ) { }
    async createHistoryCamera(historyCameraData: Camera[], timeHr: string, timeMin: string): Promise<void> {

        historyCameraData.forEach((camera, i) => {
            try {
                const { id, createAt, ...data } = camera;
                let newHistoryCamera = new HistoryCamera();
                newHistoryCamera = data;
                newHistoryCamera.timeHr = timeHr.replace(/^0+/, '');
                newHistoryCamera.timeMin = timeMin.replace(/^0+/, '');
                newHistoryCamera.createAt = new Date();
                this.historyCameraRepository.save(newHistoryCamera);
            } catch (error) {
                console.log(error);
            }
        });
    }
    async getAllHistoryCamera(filter?: object): Promise<HistoryCamera[]> {
        const historyCameraData = await this.historyCameraRepository.find(filter);
        if (!historyCameraData || historyCameraData.length == 0) {
            throw new NotFoundException('History camera data not found!');
        }
        return historyCameraData;

    }

}