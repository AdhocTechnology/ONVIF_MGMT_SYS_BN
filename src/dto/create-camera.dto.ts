import { IsNotEmpty, Validate } from "class-validator";
import { CustomIPcameraLength } from '../validator/ipAddrValidator';
export class CreateCameraDto {
    @Validate(CustomIPcameraLength)
    @IsNotEmpty() 
    readonly ipCamera: string;
    @IsNotEmpty() 
    readonly username: string;
    @IsNotEmpty() 
    readonly password: string;

    readonly warrantyExp: string;
}