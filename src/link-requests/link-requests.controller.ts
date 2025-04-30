import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LinkRequestsService } from './link-requests.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/enums';

interface JwtPayload {
    sub: number;
    role: UserRole;
}

@Controller('link-requests')
export class LinkRequestsController {
    constructor(private linkRequestsService : LinkRequestsService) {}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.PSICOLOGO)
    @Get('meus-pacientes')
    findMyPatients(@Req() req: { user: JwtPayload }) {
        const psychologistId = req.user.sub;
        return this.linkRequestsService.getLinks(psychologistId);
    }

}
