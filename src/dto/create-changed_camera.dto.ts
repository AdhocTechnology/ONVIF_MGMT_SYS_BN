import { IsNotEmpty } from "class-validator";
export class CreateChangedCameraDto {
    @IsNotEmpty()
    readonly ipCamera: string;
    
    readonly oldModel: string;
    readonly oldManufacturer: string;
    readonly oldSerialNumber: string;
    readonly oldHardwareId: string;
    readonly oldFirmwareVersion: string;
    readonly oldPort?: number;

    readonly newModel: string;
    readonly newManufacturer: string;
    readonly newSerialNumber: string;
    readonly newHardwareId: string;
    readonly newFirmwareVersion: string;
    readonly newPort?: number;
}