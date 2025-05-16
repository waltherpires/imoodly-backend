import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionStatus, Psychologist } from './psychologist.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

export class PsychologistService {
  constructor(
    @InjectRepository(Psychologist) private repo: Repository<Psychologist>,
  ) {}

  create(crp: string, user: User) {
    const profile = this.repo.create({ crp, user });
    return this.repo.save(profile);
  }

  async getAvailablePsychologists() {
    const openPsychologists = await this.repo.find({
      where: { connectionStatus: ConnectionStatus.OPEN },
      relations: ['user'],
    });

    return openPsychologists;
  }

  async changeConnectionVisibility(userId: number) {
    const psychologist = await this.get(userId);

    psychologist.connectionStatus =
      psychologist.connectionStatus === ConnectionStatus.OPEN
        ? ConnectionStatus.CLOSED
        : ConnectionStatus.OPEN;

    return this.repo.save(psychologist);
  }

  async get(userId: number) {
    const psychologist = await this.repo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!psychologist) {
      throw new NotFoundException('Psicólogo não encontrado.');
    }

    return psychologist;
  }
}
