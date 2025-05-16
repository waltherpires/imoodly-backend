import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  constructor(private linkRequestsService: LinkRequestsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PSICOLOGO)
  @Get('my-patients')
  findMyPatients(@Req() req: { user: JwtPayload }) {
    const psychologistId = req.user.sub;
    return this.linkRequestsService.getLinks(psychologistId);
  }

  @UseGuards(AuthGuard)
  @Post(':receiverid')
  requestConnection(
    @Req() req,
    @Param('receiverid', ParseIntPipe) recipientId: number,
  ) {
    const requesterId = req.user.id;

    if (!requesterId || !recipientId) {
      throw new ForbiddenException('Você não pode fazer esta ação.');
    }

    return this.linkRequestsService.createRequest(requesterId, recipientId);
  }

  @UseGuards(AuthGuard)
  @Patch('accept/:requestid')
  acceptRequest(
    @Req() req,
    @Param('requestid', ParseIntPipe) requestId: number,
  ) {
    const recipientId = req.user.id;
    return this.linkRequestsService.acceptRequest(requestId, recipientId);
  }

  @UseGuards(AuthGuard)
  @Get('received')
  getReceivedRequests(@Req() req) {
    const recipientId = req.user.id;
    return this.linkRequestsService.getReceiveRequests(recipientId);
  }

}
