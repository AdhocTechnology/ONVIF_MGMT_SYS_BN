import { Body, Controller, OnModuleInit, Delete, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CreateSchedulerDto } from '../dto/create-scheduler.dto';
import { UpdateSchedulerDto } from '../dto/update-scheduler.dto';
import { SchedulerService } from './scheduler.service';
import { CronService } from '../cron/cron.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Scheduler } from './scheduler.entity';
@UseGuards(JwtAuthGuard)
@Controller('scheduler')
export class SchedulerController implements OnModuleInit {
    constructor(
        private readonly schedulerService: SchedulerService,
        private readonly cronService: CronService,
    ) {
    }

    async onModuleInit() {
        await this.cronService.setupAllCrons();
    }

    @Post()
    async createScheduler(@Res() response, @Body() createSchedulerDto: CreateSchedulerDto): Promise<Scheduler> {
        try {
            const newScheduler = await this.schedulerService.createScheduler(createSchedulerDto);
            this.cronService.addCronJob(newScheduler.id, newScheduler.timeHr, newScheduler.timeMin);
            return response.status(HttpStatus.CREATED).json({
                message: 'Scheduler has been created successfully',
                newScheduler,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Put('/:id')
    async updateScheduler(@Res() response, @Param('id') schedulerId: number,
        @Body() updateSchedulerDto: UpdateSchedulerDto) {
        try {
            const existingScheduler = await this.schedulerService.updateScheduler(schedulerId, updateSchedulerDto);
            this.cronService.deleteCron(existingScheduler.id);
            this.cronService.addCronJob(existingScheduler.id, existingScheduler.timeHr, existingScheduler.timeMin);
            return response.status(HttpStatus.OK).json({
                message: 'Scheduler has been successfully updated',
                existingScheduler,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get()
    async getAllScheduler(@Res() response) {
        try {
            const schedulerData = await this.schedulerService.getAllScheduler();
            return response.status(HttpStatus.OK).json({
                message: 'All scheduler data found successfully', schedulerData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
    @Get('/:id')
    async getScheduler(@Res() response, @Param('id') schedulerId: number) {
        try {
            const existingScheduler = await
                this.schedulerService.getScheduler(schedulerId);
            return response.status(HttpStatus.OK).json({
                message: 'Scheduler found successfully', existingScheduler,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
    @Delete('/:id')
    async deleteScheduler(@Res() response, @Param('id') schedulerId: number) {
        try {
            const deletedScheduler = await this.schedulerService.deleteScheduler(schedulerId);
            this.cronService.deleteCron(schedulerId);
            return response.status(HttpStatus.OK).json({
                message: 'Scheduler deleted successfully',
                deletedScheduler,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}