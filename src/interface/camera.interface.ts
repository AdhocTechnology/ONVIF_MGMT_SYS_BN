import { Document } from 'mongoose';
export interface ICamera extends Document {
    readonly ipCamera: string;
    readonly username: string;
    readonly password: string;
    readonly warrantyExp ?: string;
    manufacturer: string;
    model: string;
    serialNumber: number;
    hardwareId: string;
    firmwareVersion: string;
    port?: number;
    createAt: string;
    status: boolean;
    responseTime?: string;
}

