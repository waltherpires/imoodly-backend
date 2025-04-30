import { UserRole } from 'src/common/enums/enums';
import { MoodLog } from 'src/mood-logs/mood-log.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  fullname: string;

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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'psychologist_id' })
  psychologist: User;
}
