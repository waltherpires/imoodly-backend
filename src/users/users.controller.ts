import { Body, Controller, Get, Param, Patch, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @UseGuards(AuthGuard)
    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() updateUser: Partial<UserDto>, @User() loggedUser: any) {
        if (Number(id) !== loggedUser.id) {
            throw new UnauthorizedException('Você não tem permissão para atualizar este usuário.');
        }
        
        const user = await this.usersService.update(Number(id), updateUser);
        return user;
    }
}
