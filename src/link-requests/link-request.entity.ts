import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum LinkRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity('link_requests')
export class LinkRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'recipient_id' })
    recipient: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'requester_id'})
    requester: User;

    @Column({
        type: 'enum',
        enum: LinkRequestStatus,
        default: LinkRequestStatus.PENDING
    })
    status: LinkRequestStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}