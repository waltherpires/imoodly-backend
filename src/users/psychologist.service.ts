import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionStatus, Psychologist } from './psychologist.entity';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { LinkRequestsService } from 'src/link-requests/link-requests.service';

export class PsychologistService {
  constructor(
    @InjectRepository(Psychologist) private repo: Repository<Psychologist>,
    private linkRequestService: LinkRequestsService,
  ) {}

  create(crp: string, user: User) {
    const profile = this.repo.create({ crp, user });
    return this.repo.save(profile);
  }

  async getAvailablePsychologistsWithStatusForPatient(patientId: number) {
    const openPsychologists = await this.repo.find({
      where: { connectionStatus: ConnectionStatus.OPEN },
      relations: ['user'],
    });

    const activeLink = await this.linkRequestService.getLinks(patientId)

    const pendingRequests = await Promise.all(
      openPsychologists.map(async (psychologist) => {
        const hasPending = await this.linkRequestService.hasPendingRequestBetween(patientId, psychologist.user.id);
        return { psychologist, hasPendingRequest: hasPending,};
      }),
    );

    const result = pendingRequests.map((item) => ({
      ...item.psychologist,
      hasPendingRequest: item.hasPendingRequest,
      hasActiveLink: activeLink.length > 0,
    }));

    return result;
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
