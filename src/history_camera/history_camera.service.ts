import { Injectable, NotFoundException } from '@nestjs/common';
import { HistoryCamera } from './history_camera.entity';
import { Camera } from '../camera/camera.entity';
import { Repository, LessThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class HistoryCameraService {
    constructor(
        @InjectRepository(HistoryCamera)
        private readonly historyCameraRepository: Repository<HistoryCamera>
    ) {
    }
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

    async clearOldData(): Promise<void> {
        const threeMonthAgoDate = new Date();
        threeMonthAgoDate.setMonth(threeMonthAgoDate.getMonth() - 3);
        await this.historyCameraRepository.createQueryBuilder()
            .delete()
            .where("createAt <= :date", { date: threeMonthAgoDate })
            .execute()
    }

}