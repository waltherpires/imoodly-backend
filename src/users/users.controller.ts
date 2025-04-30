import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user-dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/enums';

interface JwtPayload {
    sub: number;
    role: UserRole;
}

@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.PSICOLOGO)
    @Get('pacientes')
    findALlPatients(@Req() req: { user: JwtPayload }) {
        const psychologistId = req.user.sub;
        return this.usersService.findPatients(psychologistId);
    }

    @Get()
    findAllPatients(@Param('id') psychologistId: string) {
        return this.usersService.findPatients(Number(psychologistId));
    }
}
