import { Type } from "class-transformer";
import { IsNotEmpty, Max, Min } from "class-validator";
export class CreateSchedulerDto {
    @IsNotEmpty()
    @Min(0)
    @Max(23)
    @Type(() => Number)
    timeHr: string;

    @IsNotEmpty()
    @Min(0)
    @Max(59)
    @Type(() => Number)
     timeMin: string;
}