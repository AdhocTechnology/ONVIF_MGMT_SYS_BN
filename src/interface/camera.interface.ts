import { Document } from 'mongoose';
export interface ICamera extends Document {
    readonly ipCamera: string;
    readonly username: string;
    readonly password: string;
    readonly warrantyExp ?: string;
    brand: string;
    model: string;
    createAt: string;
    status: boolean;
}

