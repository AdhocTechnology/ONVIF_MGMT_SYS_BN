import {Body, Controller, Get, HttpException, HttpStatus, Post} from '@nestjs/common';
import {MGetAllDevicesInfo, MGetConnectionStatus} from "./onvif.model";
import {
    CameraStatus,
    IAllDevicesInfoResponse,
    IAllDevicesResponseWithTime,
    ICheckConnect,
    IGetAllDevicesInfo
} from "./onvif.interface";
import {OnvifService} from "./onvif.service";

export const NUMBER_OF_LOOP_CHECKING: number = 3;

@Controller('onvif')
export class OnvifController {
    constructor(
        private onvifService: OnvifService
    ) {
    }

    // @Get('/devices')
    // async getAllDevicesInfo(@Body() body: MGetAllDevicesInfo[]): Promise<IAllDevicesResponseWithTime> {
    //     console.time('getAllDevicesInfo');
    //     const devicesPromise: Promise<IAllDevicesInfoResponse[]>[] = [];
    //     let devices: IAllDevicesInfoResponse[] = [];
    //     try {
    //         for (let i = 0; i < NUMBER_OF_LOOP_CHECKING; i++) {
    //             devicesPromise.push(this.onvifService.getAllDevicesInfo(body));
    //         }
    //         const res = await Promise.all(devicesPromise);
    //         for (let i = 0; i < res.length; i++) {
    //             devices = devices.concat(res[i]);
    //         }
    //     } catch (e) {
    //         throw new HttpException({
    //             reason: 'error.get.all.devices.info',
    //             status: HttpStatus.INTERNAL_SERVER_ERROR
    //         }, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }

    //     let response: IAllDevicesResponseWithTime;
    //     const duplicateIds = devices
    //         .map(v => v.ipCamera)
    //         .filter((v, i, vIds) => vIds.indexOf(v) !== i)
    //     const duplicates = devices
    //         .filter(obj => duplicateIds.includes(obj.ipCamera));
    //     const filterObj = duplicates.filter((value, index, self) =>
    //             index === self.findIndex((t) => (
    //                 t.ipCamera === value.ipCamera
    //             ))
    //     );
    //     response = {
    //         devices: filterObj,
    //         responseTime: new Date()
    //     }
    //     if(response.devices.length === 0) {
    //         response = {
    //             devices: []
    //         }
    //     }
    //     console.timeEnd('getAllDevicesInfo');
    //     return response;
    // }

    // @Post('/connection')
    // async getConnectStatus(@Body() body: MGetConnectionStatus): Promise<ICheckConnect> {
    //     console.time('checkConnection');
    //     const mapBody: IGetAllDevicesInfo[] = [];
    //     mapBody.push(body);
    //     let deviceInfo: IAllDevicesInfoResponse[] = [];
    //     let isReturn: boolean = false;
    //     try {
    //         deviceInfo = await this.onvifService.getAllDevicesInfo(mapBody);
    //         if (deviceInfo.length !== 0) {
    //             isReturn = true;
    //         }
    //     } catch (e) {
    //         throw new HttpException({
    //             reason: 'error.get.connection',
    //             status: HttpStatus.INTERNAL_SERVER_ERROR
    //         }, HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    //     let response: ICheckConnect;
    //     if (isReturn) {
    //         response = {
    //             status: CameraStatus.connected,
    //             devices: deviceInfo[0]
    //         }
    //     } else {
    //         response = {
    //             status: CameraStatus.canTConnect,
    //         }
    //     }
    //     console.timeEnd('checkConnection');
    //     return response;
    // }

}
