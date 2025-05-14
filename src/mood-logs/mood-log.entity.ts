import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MoodEmotion } from "./mood-emotion.entity";

@Entity('mood_logs')
export class MoodLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.moodLogs)
    user: User;

    @Column()
    title: string;

    @Column({ type: 'text'})
    description: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(() => MoodEmotion, (moodEmotion) => moodEmotion.moodLog, { cascade: true })
    emotions: MoodEmotion[];
}