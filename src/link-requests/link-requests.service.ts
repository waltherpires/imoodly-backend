import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkRequest, LinkRequestStatus } from './link-request.entity';
import { Repository } from 'typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/notification.entity';

@Injectable()
export class LinkRequestsService {
  constructor(
    @InjectRepository(LinkRequest) private repo: Repository<LinkRequest>,
    private notificationService: NotificationsService,
  ) {}

  async createRequest(requesterId: number, recipientId: number) {
    const alreadyExists = await this.hasPendingRequestBetween(
      requesterId,
      recipientId,
    );
    if (alreadyExists) {
      throw new ForbiddenException(
        'Já existe uma solicitação pendente entre vocês.',
      );
    }

    const request = this.repo.create({
      requester: { id: requesterId },
      recipient: { id: recipientId },
    });

    const savedRequest = await this.repo.save(request);

    await this.notificationService.createNotification({
      type: NotificationType.LINK_REQUEST,
      senderId: String(requesterId),
      receiverId: String(recipientId),
      resourceId: String(savedRequest.id),
      data: { message: `Solicitação de acompanhamento de ${request.requester.name}` }
    });

    return savedRequest;
  }

  async updateRequestStatus(
    requestId: number,
    recipientId: number,
    status: LinkRequestStatus,
  ) {
    const request = await this.repo.findOneOrFail({
      where: { id: requestId },
      relations: ['recipient'],
    });

    if (request.recipient.id !== recipientId) {
      throw new ForbiddenException(
        'Você não tem permissão para aceitar essa solicitação.',
      );
    }

    request.status = status;
    const updatedRequest = await this.repo.save(request);

    if(status === LinkRequestStatus.ACCEPTED) {
      await this.notificationService.createNotification({
        type: NotificationType.LINK_ACCEPTED,
        senderId: String(recipientId),
        receiverId: String(request.requester.id),
        resourceId: String(request.id),
        data: { message: 'Seu pedido de vínculo foi aceito,' }
      });
    }
  }

  async getReceiveRequests(recipientId: number) {
    return this.repo.find({
      where: {
        recipient: { id: recipientId },
        status: LinkRequestStatus.PENDING,
      },
      relations: ['requester'],
    });
  }

  async getPsychologistLinks(userId: number) {
    return this.repo.find({
      where: [
        { recipient: { id: userId }, status: LinkRequestStatus.ACCEPTED },
      ],
      relations: ['requester', 'recipient'],
    });
  }

  async getLinks(userId: number) {
    return this.repo.find({
      where: [
        { recipient: { id: userId }, status: LinkRequestStatus.ACCEPTED },
        { requester: { id: userId }, status: LinkRequestStatus.ACCEPTED },
      ],
      relations: ['requester', 'recipient'],
    });
  }

  async getPatientLink(userId: number) {
    return this.repo.find({
      where: [
        { requester: { id: userId }, status: LinkRequestStatus.ACCEPTED },
      ],
      relations: ['requester', 'recipient'],
    });
  }

  async getPsychologistLinkedToUser(userId: number): Promise<number[]> {
    const links = await this.getLinks(userId);

    return links
      .map(link =>
        link.requester.id !== userId ? link.requester : link.recipient
      )
      .filter(user => user.role === 'psicologo')
      .map(user => user.id);
  }

  async hasAcceptedLinkBetween(
    userAId: number,
    userBId: number,
  ): Promise<boolean> {
    const link = await this.repo.findOne({
      where: [
        {
          requester: { id: userAId },
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

  async hasPendingRequestBetween(
    requesterId: number,
    recipientId: number,
  ): Promise<boolean> {
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
