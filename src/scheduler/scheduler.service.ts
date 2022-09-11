import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSchedulerDto } from '../dto/create-scheduler.dto';
import { IScheduler } from '../interface/scheduler.interface';
import { Model } from "mongoose";
import { UpdateSchedulerDto } from '../dto/update-scheduler.dto';

@Injectable()
export class SchedulerService {
    constructor(@InjectModel('scheduler_data') private schedulerModel: Model<IScheduler>) { }
    async createScheduler(createSchedulerDto: CreateSchedulerDto): Promise<IScheduler> {
        const newScheduler = await new this.schedulerModel(createSchedulerDto);
        // timeHr
        // timeMin
        const existingScheduler = await this.schedulerModel.findOne({ timeHr: newScheduler.timeHr, timeMin: newScheduler.timeMin });
        
        if (existingScheduler) {
            throw new ConflictException(`scheduler is already exist`);
        }

        newScheduler.timeHr = newScheduler.timeHr.replace(/^0+/, '');
        newScheduler.timeMin = newScheduler.timeMin.replace(/^0+/, '');
        // newScheduler._uuid = new Date().toLocaleDateString()+`/${newScheduler.timeHr}/${newScheduler.timeMin}`;

        newScheduler.createAt = new Date().toISOString();
        return newScheduler.save();
    }
    async updateScheduler(schedulerId: string, updateSchedulerDto: UpdateSchedulerDto): Promise<IScheduler> {
        const existingScheduler = await this.schedulerModel.findByIdAndUpdate(schedulerId, updateSchedulerDto, { new: true });
        if (!existingScheduler) {
            throw new NotFoundException(`scheduler #${schedulerId} not found`);
        }
        return existingScheduler;
    }
    async getAllScheduler(): Promise<IScheduler[]> {
        const schedulerData = await this.schedulerModel.find();
        if (!schedulerData || schedulerData.length == 0) {
            throw new NotFoundException('Scheduler data not found!');
        }
        return schedulerData;
    }
    async getScheduler(schedulerId: string): Promise<IScheduler> {
        const existingScheduler = await this.schedulerModel.findById(schedulerId).exec();
        if (!existingScheduler) {
            throw new NotFoundException(`Scheduler #${schedulerId} not found`);
        }
        return existingScheduler;
    }
    async deleteScheduler(schedulerId: string): Promise<IScheduler> {
        const deletedScheduler = await this.schedulerModel.findByIdAndDelete(schedulerId);
        if (!deletedScheduler) {
            throw new NotFoundException(`Scheduler #${schedulerId} not found`);
        }
        return deletedScheduler;
    }
}