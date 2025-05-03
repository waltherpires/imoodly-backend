import { UserRole } from 'src/common/enums/enums';
import { MoodLog } from 'src/mood-logs/mood-log.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Psychologist } from './psychologist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => MoodLog, (moodLog) => moodLog.user)
  moodLogs: MoodLog[];

  @OneToOne(() => Psychologist, (psychologist) => psychologist.user, { cascade: true })
  psychologistProfile: Psychologist;
}
