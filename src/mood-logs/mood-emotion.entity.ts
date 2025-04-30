import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MoodLog } from "./mood-log.entity";
import { Emotion } from "src/common/enums/enums";

@Entity('mood_emotions')
export class MoodEmotion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MoodLog, (moodLog) => moodLog.emotions)
    moodLog: MoodLog;

    @Column({ type: 'enum', enum: Emotion})
    emotion: Emotion;
}