import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


export enum GoalStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    IN_PROGRESS = 'in_progress',
}

@Entity('goals')
export class Goal {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.goals)
    user: User;

    @Column()
    title: string;

    @Column({ type: 'text' , nullable: true })
    description: string;

    @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.PENDING })
    status: GoalStatus;

    @Column()
    totalSteps: number;
    
    @Column({ default: 0 })
    currentStep: number;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;
}