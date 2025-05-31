import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { PsychologistService } from './psychologist.service';
import { PsychologistDto } from './dto/psychologist.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/enums';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private psychologistsService: PsychologistService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  findAllUsers(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUser: Partial<UserDto>,
    @User() loggedUser: any,
  ) {
    if (Number(id) !== loggedUser.id) {
      throw new UnauthorizedException(
        'Você não tem permissão para atualizar este usuário.',
      );
    }

    const user = await this.usersService.update(Number(id), updateUser);
    return user;
  }

  @Get('psychologists')
  @UseGuards(AuthGuard)
  @Serialize(PsychologistDto)
  async getPsychologistsList(@Req() req) {
    const patientId = req.user.id;
    const list =
      await this.psychologistsService.getAvailablePsychologistsWithStatusForPatient(
        patientId,
      );

    return list;
  }

  @Patch('psychologist/change-visibility')
  @UseGuards(AuthGuard)
  @Serialize(PsychologistDto)
  async toggleConnectionVisibility(@Req() request) {
    const userId = request.user.id;
    const updatedPsychologist =
      await this.psychologistsService.changeConnectionVisibility(userId);
    return updatedPsychologist;
  }

  @Get('me/psychologist')
  @Roles(UserRole.PSICOLOGO)
  @UseGuards(AuthGuard)
  @Serialize(PsychologistDto)
  async getLoggedPsychologist(@Req() req) {
    const userId = req.user.id;
    const psychologist = await this.psychologistsService.get(userId);
    if (!psychologist) {
      throw new UnauthorizedException('Usuário não é um psicólogo.');
    }

    return psychologist;
  }
}
