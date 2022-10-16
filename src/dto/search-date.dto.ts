import { IsNotEmpty } from "class-validator";
export class SearchDateDto {
    @IsNotEmpty()
    startDate: string;

    @IsNotEmpty()
    endDate: string;
}