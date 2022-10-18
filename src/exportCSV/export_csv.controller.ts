import { Body, Controller, Delete, Get, StreamableFile, HttpException, HttpStatus, OnModuleInit, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CreateCameraDto } from '../dto/create-camera.dto';
import { UpdateCameraDto } from '../dto/update-camera.dto';
import { SearchDateDto } from '../dto/search-date.dto';
import { CameraService, NUMBER_OF_LOOP_CHECKING } from '../camera/camera.service';
import { HistoryCameraService } from '../history_camera/history_camera.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IAllDevicesInfoResponse, IAllDevicesResponseWithTime } from '../onvif/onvif.interface';
import { OnvifService } from '../onvif/onvif.service';
import { ChangedCameraService } from '../changedCamera/changedCamera.service';
import { ExportCsvService } from './export_csv.service';
import { MGetAllDevicesInfo } from '../onvif/onvif.model';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
import * as fs from 'fs';
import { join } from 'path';
import { ICamera } from '../interface/camera.interface';
import { Between } from 'typeorm';
// import { Camera } from './camera.entity';

// import { CronService } from '../cron/cron.service';
// @UseGuards(JwtAuthGuard)
@Controller('exportCSV')
export class ExportCsvController {
    constructor(
        private readonly cameraService: CameraService,
        private readonly exportCsvService: ExportCsvService,
        private readonly historyCameraService: HistoryCameraService,
    ) {

    }

    @Post()
    async historyCamera(@Res() response, @Body() searchDate: SearchDateDto): Promise<any> {
        try {
            let endDate = new Date(searchDate.endDate);
            endDate.setDate(endDate.getDate() + 1);
            const filter = {
                where: {
                    status: 0,
                    createAt: Between(
                        new Date(searchDate.startDate),
                        endDate
                    ),
                },
                order: {
                    createAt: "ASC"
                }
            };

            const allHistoryCamera = await this.historyCameraService.getAllHistoryCamera(filter);

            const fileName = await this.exportCsvService.createHistoryCSV(allHistoryCamera);
            console.log(join(process.cwd() + '/exportCSVFile/history/', fileName));

            return response.status(HttpStatus.OK).download(join(process.cwd() + '/exportCSVFile/history', fileName));
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }


    @Get()
    async currentCamera(@Res() response): Promise<any> {
        try {
            const allCamera = await this.cameraService.getAllCamera();
            const fileName = await this.exportCsvService.createCurrentCSV(allCamera);

            const rs = fs.createReadStream("./exportCSVFile/current/"+ fileName);
            response.setHeader("Content-Disposition", "attachment; filename="+fileName);
            rs.pipe(response);

        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }


}