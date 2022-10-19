import { IsNotEmpty } from "class-validator";
import { ICamera } from "src/interface/camera.interface";
export class CreateHistoryCameraDto {
    @IsNotEmpty()
    readonly cameras: ICamera[];
}