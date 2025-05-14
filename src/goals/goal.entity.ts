import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

Entity('goals')
export class Goal {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.goals)
    user: User;

    @Column()
    title: string;

    @Column({ type: 'text' , nullable: true })
    description: string;

    @Column({ default: 'pending'})
    status: 'pending' | 'completed' | 'in-progress';

    @Column({ nullable: true })
    totalSteps: number;
    
    @Column({ default: 0 })
    currentStep: number;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;
}