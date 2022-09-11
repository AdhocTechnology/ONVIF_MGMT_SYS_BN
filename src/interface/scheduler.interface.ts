import { Document } from 'mongoose';
export interface IScheduler extends Document {
    timeHr: string;
    timeMin: string;
    createAt: string;
}

