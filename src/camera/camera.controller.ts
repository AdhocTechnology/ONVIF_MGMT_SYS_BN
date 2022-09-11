import { Body, Controller, Delete, Get, HttpStatus, OnModuleInit, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CreateCameraDto } from '../dto/create-camera.dto';
import { UpdateCameraDto } from '../dto/update-camera.dto';
import { CameraService } from './camera.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { CronService } from '../cron/cron.service';
@UseGuards(JwtAuthGuard)
@Controller('camera')
export class CameraController  {
    constructor(
        private readonly cameraService: CameraService,
        // private readonly cronService: CronService,
    ) {



    }

    // async onModuleInit() {
    //     await this.cronService.setupAllCrons();
    //     // this.cronService.deleteCron('6314d671f15190cecd418650');
    //     // console.log(this.cronService.getAllCronsId());
        
    // }

    @Post()
    async createCamera(@Res() response, @Body() createCameraDto: CreateCameraDto) {
        try {
            const newCamera = await this.cameraService.createCamera(createCameraDto);
            return response.status(HttpStatus.CREATED).json({
                message: 'Camera has been created successfully',
                newCamera,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
            // return response.status(HttpStatus.BAD_REQUEST).json({
            //     statusCode: 400,
            //     message: 'Error: Camera not created!',
            //     error: 'Bad Request'
            // });
        }
    }
    @Put('/:id')
    async updateCamera(@Res() response, @Param('id') cameraId: string,
        @Body() updateCameraDto: UpdateCameraDto) {
        try {
            const existingCamera = await this.cameraService.updateCamera(cameraId, updateCameraDto);
            return response.status(HttpStatus.OK).json({
                message: 'Camera has been successfully updated',
                existingCamera,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get()
    async getAllCamera(@Res() response) {
        try {
            const cameraData = await this.cameraService.getAllCamera();
            return response.status(HttpStatus.OK).json({
                message: 'All camera data found successfully', cameraData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
    @Get('/:id')
    async getCamera(@Res() response, @Param('id') cameraId: string) {
        try {
            const existingCamera = await
                this.cameraService.getCamera(cameraId);
            return response.status(HttpStatus.OK).json({
                message: 'Camera found successfully', existingCamera,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
    @Delete('/:id')
    async deleteCamera(@Res() response, @Param('id') cameraId: string) {
        try {
            const deletedCamera = await this.cameraService.deleteCamera(cameraId);
            return response.status(HttpStatus.OK).json({
                message: 'Camera deleted successfully',
                deletedCamera,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }
}