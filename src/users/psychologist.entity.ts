import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user.entity";

export enum ConnectionStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

@Entity()
export class Psychologist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    crp: string;

    @OneToOne(() => User, (user) => user.psychologistProfile)
    @JoinColumn()
    user: User;

    @Column({
        type: 'enum',
        enum: ConnectionStatus,
        default: ConnectionStatus.CLOSED,
    })
    connectionStatus: ConnectionStatus;
}