import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if(!user || !(await bcrypt.compare(pass, user.password))) {
        throw new UnauthorizedException('E-mail ou senha incorretos!');
    }

    const payload = { id: user.id, username: user.email, role: user.role };

    return {
        access_token: await this.jwtService.signAsync(payload),
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersService.findByEmail(createUserDto.email);

    if (user) {
        throw new BadRequestException('E-mail já cadastrado!');
    }

    const saltOrRounds = parseInt(this.configService.get<string>('BCRYPT_SALT_ROUNDS') || '13', 10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const newUserData = {
        ...createUserDto,
        password: hashedPassword,
    }

    return this.usersService.create(newUserData);
  }
}
