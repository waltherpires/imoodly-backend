import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkRequest, LinkRequestStatus } from './link-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LinkRequestsService {
  constructor(
    @InjectRepository(LinkRequest) private repo: Repository<LinkRequest>,
  ) {}

  async createRequest(requesterId: number, recipientId: number) {
    const alreadyExists = await this.hasPendingRequestBetween(requesterId, recipientId);
    if (alreadyExists) {
      throw new ForbiddenException('Já existe uma solicitação pendente entre vocês.');
    }

    const request = this.repo.create({
      requester: { id: requesterId },
      recipient: { id: recipientId },
    });

    return this.repo.save(request);
  }

  async acceptRequest(requestId: number, recipientId: number) {
    const request = await this.repo.findOneByOrFail({ id: requestId });

    if (request.recipient.id !== recipientId) {
      throw new ForbiddenException("Você não tem permissão para aceitar essa solicitação.");
    }

    request.status = LinkRequestStatus.ACCEPTED;
    return this.repo.save(request);
  }

  async getReceiveRequests(recipientId: number) {
    return this.repo.find({
      where: { recipient: { id: recipientId } },
      relations: ['requester'],
    });
  }

  async getLinks(userId: number) {
    return this.repo.find({
      where: [
        { requester: { id: userId }, status: LinkRequestStatus.ACCEPTED },
        { recipient: { id: userId }, status: LinkRequestStatus.ACCEPTED },
      ],
      relations: ['requester', 'recipient'],
    });
  }

  async hasAcceptedLinkBetween(userAId: number, userBId: number): Promise<boolean> {
    const link = await this.repo.findOne({
      where: [
        {
          requester: { id:  userAId },
          recipient: { id: userBId },
          status: LinkRequestStatus.ACCEPTED,
        },
        {
          requester: { id: userBId },
          recipient: { id: userAId },
          status: LinkRequestStatus.ACCEPTED,
        },
      ],
      relations: ['requester', 'recipient'],
    });

    return !!link;
  }

  async hasPendingRequestBetween(requesterId: number, recipientId: number): Promise<boolean> {
    const existingRequest = await this.repo.findOne({
      where: [
        {
          requester: { id: requesterId },
          recipient: { id: recipientId },
          status: LinkRequestStatus.PENDING,
        },
        {
          requester: { id: recipientId },
          recipient: { id: requesterId },
          status: LinkRequestStatus.PENDING,
        },
      ],
      relations: ['requester', 'recipient'],
    });

    return !!existingRequest;
  }
}
