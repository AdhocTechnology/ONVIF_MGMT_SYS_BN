import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Scheduler {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    timeHr: string;
    @Column()
    timeMin: string;
    @Column()
    createAt: string;
}
