import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { LinkRequestsService } from "./link-requests.service";
import { Request } from "express";

@Injectable()
export class IsPsychologistOfGuard implements CanActivate {
    constructor(private readonly linkRequestService: LinkRequestsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const { user } = context.switchToHttp().getRequest();
        const patientId = parseInt(request.params.patientId, 10);

        if (!user) {
            throw new ForbiddenException('Usuário não autenticado');
        }

        if(user.id === patientId) {
            return true;
        }

        const hasLink = await this.linkRequestService.hasAcceptedLinkBetween(user.id, patientId);

        if (!hasLink) {
            throw new ForbiddenException('Você não tem permissão para acessar os dados desse paciente.');
        }

        return true;
    }
}