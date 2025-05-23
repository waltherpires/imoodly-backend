import {
  Body,
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
import { LinkRequestStatus } from './link-request.entity';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { LinkRequestDto } from './dto/link-request.dto';
interface JwtPayload {
  sub: number;
  role: UserRole;
}
@Controller('link-requests')
export class LinkRequestsController {
  constructor(private linkRequestsService: LinkRequestsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.PSICOLOGO)
  @Serialize(LinkRequestDto)
  @Get('my-patients')
  findMyPatients(@Req() req: { user: JwtPayload }) {
    const psychologistId = req.user.sub;
    return this.linkRequestsService.getPsychologistLinks(psychologistId);
  }

  @UseGuards(AuthGuard)
  @Roles(UserRole.PACIENTE)
  @Serialize(LinkRequestDto)
  @Get('my-psychologist')
  findMyPsychologist(@Req() req) {
    const userId = req.user.id;
    return this.linkRequestsService.getPatientLink(userId);
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
  @Patch(':requestid/status')
  updateRequestStatus(
    @Req() req,
    @Param('requestid', ParseIntPipe) requestId: number,
    @Body('status') status: LinkRequestStatus,
  ) {
    const recipientId = req.user.id;
    return this.linkRequestsService.updateRequestStatus(
      requestId,
      recipientId,
      status,
    );
  }

  @UseGuards(AuthGuard)
  @Get('received')
  getReceivedRequests(@Req() req) {
    const recipientId = req.user.id;
    return this.linkRequestsService.getReceiveRequests(recipientId);
  }
}
