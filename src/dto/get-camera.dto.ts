import { IsNotEmpty } from "class-validator";
export class GetCameraDto {
    @IsNotEmpty() 
    readonly take : number;
    @IsNotEmpty() 
    readonly skip : number;
}