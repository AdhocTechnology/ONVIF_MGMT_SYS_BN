export interface IGetAllDevicesInfo {
    ipCamera: string;
    username: string;
    password: string;
}

export interface IAllDevicesInfoResponse {
    manufacturer: string;
    model: string;
    serialNumber: number | string;
    hardwareId: string;
    firmwareVersion: string;
    ipCamera?: string;
    port?: number;
    status?: boolean;
    responseTime?: string;
}

export interface IAllDevicesResponseWithTime {
    devices: IAllDevicesInfoResponse[];
    responseTime?: Date;
}

export interface ICheckConnect {
    devices?: IAllDevicesInfoResponse;
    status?: CameraStatus;
}

export enum CameraStatus {
    connected = 'Connected',
    canTConnect = 'Can\'t Connect'
}