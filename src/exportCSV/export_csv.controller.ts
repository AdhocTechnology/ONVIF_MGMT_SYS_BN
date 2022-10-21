import { Body, Controller, Get, Post, Res, UseGuards, StreamableFile } from '@nestjs/common';
import { SearchDateDto } from '../dto/search-date.dto';
import { CameraService } from '../camera/camera.service';
import { HistoryCameraService } from '../history_camera/history_camera.service';
import { ExportCsvService } from './export_csv.service';
import * as fs from 'fs';
import { join } from 'path';
import { Between } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
            const rs = fs.createReadStream("./exportCSVFile/history/" + fileName);

            response.setHeader('Content-Type', 'text/csv');
            response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
            rs.pipe(response);

        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }


    @Get()
    async currentCamera(@Res({ passthrough: true }) response): Promise<StreamableFile> {
        try {
            const allCamera = await this.cameraService.getAllCamera();
            const fileName = await this.exportCsvService.createCurrentCSV(allCamera);

            const file = fs.createReadStream(join(process.cwd() + '/exportCSVFile/current', fileName));


            response.set({
                'Content-Type': 'text/csv',
                'Content-Disposition': `'attachment; filename=${fileName}`,
            });
            return new StreamableFile(file);

        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }




}