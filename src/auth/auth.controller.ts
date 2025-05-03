import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/auth/dto/signin-dto';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password)
    }

    @Post('signup')
    signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    getMe(@Req() req: any) {
        return {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
        }
    }
}
