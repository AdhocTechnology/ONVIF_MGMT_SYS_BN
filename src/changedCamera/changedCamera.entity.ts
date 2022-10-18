import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChangedCamera {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        nullable: true,
    })
    ipCamera: string;
    @Column({
        nullable: true,
    })
    oldModel: string;
    @Column({
        nullable: true,
    })
    oldManufacturer: string;
    @Column({
        nullable: true,
    })
    oldSerialNumber: string;
    @Column({
        nullable: true,
    })
    oldHardwareId: string;
    @Column({
        nullable: true,
    })
    oldFirmwareVersion: string;
    @Column({
        nullable: true,
    })
    oldPort?: number;

    @Column({
        nullable: true,
    })
    newModel: string;
    @Column({
        nullable: true,
    })
    newManufacturer: string;
    @Column({
        nullable: true,
    })
    newSerialNumber: string;
    @Column({
        nullable: true,
    })
    newHardwareId: string;
    @Column({
        nullable: true,
    })
    newFirmwareVersion: string;
    @Column({
        nullable: true,
    })
    newPort?: number;
    @Column({
        nullable: true,
    })
    createAt: string;
}
