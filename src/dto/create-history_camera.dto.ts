import { Type } from "class-transformer";
import { IsNotEmpty, Max, Min } from "class-validator";
import { ICamera } from "src/interface/camera.interface";
export class CreateHistoryCameraDto {
    @IsNotEmpty()
    readonly cameras: ICamera[];
    // @IsNotEmpty()
    // @Min(0)
    // @Max(23)
    // @Type(() => Number)
    // timeHr: string;

    // @IsNotEmpty()
    // @Min(0)
    // @Max(59)
    // @Type(() => Number)
    // timeMin: string;
}