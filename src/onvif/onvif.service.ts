import { Injectable } from '@nestjs/common';
import { Cam } from 'onvif';
import { IAllDevicesInfoResponse, IGetAllDevicesInfo } from "./onvif.interface";

export const DEFAULT_PORT: number = 80;
export const DEFAULT_TIMEOUT: number = 1000;

@Injectable()
export class OnvifService {
    constructor() {
    }

    async getAllDevicesInfo(body: IGetAllDevicesInfo[]): Promise<IAllDevicesInfoResponse[]> {
        const devicesInfo: IAllDevicesInfoResponse[] = [];
        for (let i = 0; i < body.length; i++) {
            let isReject: boolean = false;
            const cam = new Cam({
                hostname: body[i].ipCamera,
                username: body[i].username,
                password: body[i].password,
                port: DEFAULT_PORT,
                timeout: DEFAULT_TIMEOUT
            });
            const camInfo: IAllDevicesInfoResponse = await new Promise((resolve, reject) => {
                cam.getDeviceInformation(function (error, info) {
                    if (error) isReject = true;
                    resolve(info);
                });
            });
            if (!isReject) {
                camInfo.ipCamera = body[i].ipCamera;
                camInfo.port = DEFAULT_PORT;
                camInfo.serialNumber = camInfo.serialNumber.toString();
                devicesInfo.push(camInfo);
            }
        }
        return devicesInfo;
    }
}

