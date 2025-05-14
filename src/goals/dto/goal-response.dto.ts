import { Expose } from 'class-transformer';

export class GoalResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  totalSteps: number;

  @Expose()
  currentStep: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  dueDate: Date;

  @Expose()
  user: {
    id: number;
  };
}
