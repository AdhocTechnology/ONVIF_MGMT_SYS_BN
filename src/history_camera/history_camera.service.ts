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
    async createHistoryCamera(historyCameraData: Camera[], timeHr: string, timeMin: string): Promise<HistoryCamera> {

        // let newHistoryCameraDto = {} as IHistoryCamera;
        // newHistoryCameraDto.cameras = historyCameraData;
        // newHistoryCameraDto._uuid = new Date().toLocaleDateString() + `/${timeHr}/${timeMin}`;
        // newHistoryCameraDto.createAt = new Date().toISOString();
        // const newHistoryCamera = new this.historyCameraModel(newHistoryCameraDto);
        // return newHistoryCamera.save();
    }


}