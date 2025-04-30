import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MoodLog } from "./mood-log.entity";
import { MoodLogsModule } from "./mood-logs.module";
import { Emotion } from "src/common/enums/enums";

@Entity('mood_emotions')
export class MoodEmotion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MoodLog, (moodLog) => moodLog.emotions)
    moodLog: MoodLogsModule;

    @Column({ type: 'enum', enum: Emotion})
    emotion: Emotion;
}