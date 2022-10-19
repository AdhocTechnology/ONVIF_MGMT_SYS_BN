import {IGetAllDevicesInfo} from "./onvif.interface";

export class MGetAllDevicesInfo implements IGetAllDevicesInfo {
    ipCamera: string;
    password: string;
    username: string;
}

export class MGetConnectionStatus implements IGetAllDevicesInfo {
    ipCamera: string;
    password: string;
    username: string;
}
