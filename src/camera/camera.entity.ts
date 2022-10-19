import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Camera {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    ipCamera: string;
    @Column()
    username: string;
    @Column({ select: false })
    password: string;
    @Column({
        nullable: true,
    })
    warrantyExp: string;
    @Column({
        nullable: true,
    })
    status: boolean;
    @Column({
        nullable: true,
    })
    model: string;
    @Column({
        nullable: true,
    })
    manufacturer: string;
    @Column({
        nullable: true,
    })
    serialNumber: string;
    @Column({
        nullable: true,
    })
    hardwareId: string;
    @Column({
        nullable: true,
    })
    firmwareVersion: string;
    @Column({
        nullable: true,
    })
    port?: number;
    @Column({
        nullable: true,
    })
    responseTime?: string;
    @Column({
        nullable: true,
    })
    createAt: string;
}
