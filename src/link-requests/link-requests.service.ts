import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkRequest, LinkRequestStatus } from './link-request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LinkRequestsService {
  constructor(
    @InjectRepository(LinkRequest) private repo: Repository<LinkRequest>,
  ) {}

  async createRequest(requesterId: number, recipientId: number) {
    const request = this.repo.create({
      requester: { id: requesterId },
      recipient: { id: recipientId },
    });

    return this.repo.save(request);
  }

  async acceptRequest(requestId: number) {
    const request = await this.repo.findOneByOrFail({ id: requestId });
    request.status = LinkRequestStatus.ACCEPTED;
    return this.repo.save(request);
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
}
