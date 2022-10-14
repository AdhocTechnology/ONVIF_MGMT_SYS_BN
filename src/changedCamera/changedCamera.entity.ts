import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChangedCamera {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    ipCamera: string;
    @Column()
    oldModel: string;
    @Column()
    oldManufacturer: string;
    @Column()
    oldSerialNumber: string;
    @Column()
    oldHardwareId: string;
    @Column()
    oldFirmwareVersion: string;
    @Column()
    oldPort?: number;

    @Column()
    newModel: string;
    @Column()
    newManufacturer: string;
    @Column()
    newSerialNumber: string;
    @Column()
    newHardwareId: string;
    @Column()
    newFirmwareVersion: string;
    @Column()
    newPort?: number;
    @Column()
    createAt: string;
}
