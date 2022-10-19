import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchedulerDto } from '../dto/create-scheduler.dto';
import { UpdateSchedulerDto } from '../dto/update-scheduler.dto';
import { Scheduler } from './scheduler.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class SchedulerService {
    constructor(
        @InjectRepository(Scheduler)
        private readonly schedulerRepository: Repository<Scheduler>) { }
    async createScheduler(createSchedulerDto: CreateSchedulerDto): Promise<Scheduler> {
       
        const existingScheduler = await this.schedulerRepository.findOneBy({ timeHr: createSchedulerDto.timeHr, timeMin: createSchedulerDto.timeMin });

        if (existingScheduler) {
            throw new ConflictException(`scheduler is already exist`);
        }
        const newScheduler = new Scheduler();
        newScheduler.timeHr = createSchedulerDto.timeHr.replace(/^0+/, '');
        newScheduler.timeMin = createSchedulerDto.timeMin.replace(/^0+/, '');

        newScheduler.createAt = new Date().toISOString();
        return this.schedulerRepository.save(newScheduler);
    }
    async updateScheduler(schedulerId: number, updateSchedulerDto: UpdateSchedulerDto): Promise<Scheduler> {
        const existingScheduler = await this.schedulerRepository.findOneBy({ id: schedulerId });
        if (!existingScheduler) {
            throw new NotFoundException(`scheduler #${schedulerId} not found`);
        }
        await this.schedulerRepository.update({ id: schedulerId }, updateSchedulerDto);
        return await this.schedulerRepository.findOneBy({ id: schedulerId });
    }
    async getAllScheduler(): Promise<Scheduler[]> {
        const schedulerData = await this.schedulerRepository.find();
        return schedulerData;
    }
    async getScheduler(schedulerId: number): Promise<Scheduler> {
        const existingScheduler = await this.schedulerRepository.findOneBy({ id: schedulerId });
        if (!existingScheduler) {
            throw new NotFoundException(`Scheduler #${schedulerId} not found`);
        }
        return existingScheduler;
    }
    async deleteScheduler(schedulerId: number): Promise<void> {
        const deletedScheduler = await this.schedulerRepository.findOneBy({ id: schedulerId });
        if (!deletedScheduler) {
            throw new NotFoundException(`Scheduler #${schedulerId} not found`);
        }
        await this.schedulerRepository.delete(schedulerId);
    }
}