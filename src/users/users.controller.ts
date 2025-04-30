import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user-dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/enums';



@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.findByEmail(email);
    }

}
