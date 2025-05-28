import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum NotificationType {
    GOAL="goal",
    POST="post",
}

@Entity('notifications')
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => User)
    receiver: User;

    @Column()
    resourceId: number;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}