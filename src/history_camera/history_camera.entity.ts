import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HistoryCamera {
    @PrimaryGeneratedColumn()
    id?: number;
    @Column()
    ipCamera: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    warrantyExp: string;
    @Column()
    status: boolean;
    @Column()
    model: string;
    @Column()
    manufacturer: string;
    @Column()
    serialNumber: string;
    @Column()
    hardwareId: string;
    @Column()
    firmwareVersion: string;
    @Column()
    port?: number;
    @Column()
    responseTime?: string;
    @Column()
    timeHr?: string;
    @Column()
    timeMin?: string;
    @Column()
    createAt?: Date;
    
}
