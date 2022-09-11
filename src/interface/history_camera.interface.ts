import { Document } from 'mongoose';
import { ICamera } from './camera.interface';
export interface IHistoryCamera extends Document {
    _uuid: string;
    cameras : ICamera[];
    createAt: string;
}

