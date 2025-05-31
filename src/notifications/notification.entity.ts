import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum NotificationType {
    GOAL="goal",
    POST="post",
    LINK_REQUEST = "link_request",
    LINK_ACCEPTED = "link_accepted",
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

    @Column({ nullable: true })
    resourceId: number;

    @Column({ type: 'json', nullable: true })
    data: any;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}